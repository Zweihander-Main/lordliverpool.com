import type { GatsbyNode } from 'gatsby';
import webpack from 'webpack';
import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';

const hasPage = (
	edge: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'][number]
) => {
	if (edge.node.fields?.sourceInstanceName) {
		switch (edge.node.fields.sourceInstanceName) {
			case 'chronology':
				if (
					!edge.node.rawMarkdownBody ||
					edge.node.rawMarkdownBody.trim() === ''
				) {
					return false;
				}
				break;
			case 'pages':
				return false;
				break;
			case 'retailers':
				return false;
				break;
		}
		return true;
	}
	return false;
};

const constructPrevNextObject = (
	post: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'][number]
) => {
	if (post.node.frontmatter?.title && post.node.fields?.slug) {
		return {
			title: post.node.frontmatter.title,
			slug: post.node.fields.slug,
		};
	} else {
		return {};
	}
};

const findPrev = (
	posts: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'],
	startIndex: number,
	sourceInstanceName: string | null
) => {
	let i = startIndex - 1;
	while (i >= 0) {
		const post = posts[i];
		if (
			post.node.fields?.sourceInstanceName &&
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i--;
	}
	return null;
};

const findNext = (
	posts: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'],
	startIndex: number,
	sourceInstanceName: string | null
) => {
	let i = startIndex + 1;
	while (i < posts.length) {
		const post = posts[i];
		if (
			post.node.fields?.sourceInstanceName &&
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i++;
	}
	return null;
};

export const createPages: GatsbyNode['createPages'] = async ({
	actions,
	graphql,
}) => {
	const { createPage } = actions;
	const result = await graphql<Queries.createPagesInNodeQuery>(`
		query createPagesInNode {
			allMarkdownRemark(
				sort: { frontmatter: { date: ASC } }
				limit: 10000
			) {
				edges {
					node {
						id
						fields {
							slug
							sourceInstanceName
						}
						frontmatter {
							title
						}
						rawMarkdownBody
					}
				}
			}
		}
	`);
	if (result.errors) {
		return Promise.reject(result.errors);
	}
	const posts = result?.data?.allMarkdownRemark.edges;
	if (posts && posts.length > 0) {
		posts.forEach((edge, index, array) => {
			const id = edge.node.id;
			if (hasPage(edge) && edge.node.fields?.slug) {
				createPage({
					path: edge.node.fields.slug,
					component: path.resolve(
						`src/templates/${String(
							edge.node.fields.sourceInstanceName
						)}.tsx`
					),
					// additional data can be passed via context
					context: {
						id,
						next: findNext(
							array,
							index,
							edge.node.fields.sourceInstanceName
						),
						prev: findPrev(
							array,
							index,
							edge.node.fields.sourceInstanceName
						),
					},
				});
			}
		});
	}
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({
	node,
	actions,
	getNode,
}) => {
	const { createNodeField } = actions;
	if (node.internal.type === 'MarkdownRemark') {
		const { sourceInstanceName } = getNode(node.parent as string) as Record<
			string,
			string
		>;
		const relativePath = createFilePath({
			node,
			getNode,
			trailingSlash: false,
		});
		createNodeField({
			name: 'slug',
			node,
			value: `/${sourceInstanceName}${relativePath}`,
		});
		createNodeField({
			name: 'sourceInstanceName',
			node,
			value: sourceInstanceName,
		});
	}
};

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = (
	{ stage, actions, loaders },
	{ postCssPlugins, useResolveUrlLoader }
) => {
	const { setWebpackConfig } = actions;
	const isSSR = ['develop-html', 'build-html'].includes(stage);

	const sassLoader = {
		loader: 'sass-loader',
		options: {
			sourceMap: useResolveUrlLoader ? true : undefined,
		},
	};

	const typeLoader = {
		loader: 'dts-css-modules-loader',
		options: {
			namedExport: true,
		},
	};

	const sassRule = {
		test: /\.s(a|c)ss$/,
		use: isSSR
			? [loaders.null()]
			: [
					loaders.miniCssExtract(),
					loaders.css({
						importLoaders: 2,
						modules: false,
					}),
					loaders.postcss({ plugins: postCssPlugins }),
			  ],
	};

	const sassRuleGlobals = {
		test: /\.global\.s(a|c)ss$/,
		use: isSSR
			? [loaders.null()]
			: [
					loaders.miniCssExtract(),
					loaders.css({
						importLoaders: 2,
						modules: {
							mode: 'global',
						},
					}),
					loaders.postcss({ plugins: postCssPlugins }),
			  ],
	};

	const sassRuleModules = {
		test: /\.module\.s(a|c)ss$/,
		use: [
			!isSSR &&
				loaders.miniCssExtract({
					modules: {
						namedExport: true,
					},
				}),
			typeLoader,
			loaders.css({
				importLoaders: 2,
				modules: {
					exportLocalsConvention: 'camelCaseOnly',
				},
			}),
			loaders.postcss({ plugins: postCssPlugins }),
		].filter(Boolean),
	};

	if (useResolveUrlLoader && !isSSR) {
		const urlLoaderOptions =
			(useResolveUrlLoader as Record<string, unknown>)?.options || {};
		sassRule.use.push({
			loader: 'resolve-url-loader',
			options: urlLoaderOptions,
		});
		sassRuleModules.use.push({
			loader: 'resolve-url-loader',
			options: urlLoaderOptions,
		});
	}

	// add sass loaders
	sassRule.use.push(sassLoader);
	sassRuleGlobals.use.push(sassLoader);
	sassRuleModules.use.push(sassLoader);

	const configRules = [
		{
			oneOf: [sassRuleModules, sassRuleGlobals, sassRule],
		},
	];

	setWebpackConfig({
		module: {
			rules: configRules,
		},
		plugins: [
			new webpack.IgnorePlugin({
				resourceRegExp: /^netlify-identity-widget$/,
			}), // Prevent Netlify Identity from being bundled, undo for adding new users
		],
	});
};
