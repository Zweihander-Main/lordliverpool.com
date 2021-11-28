const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const hasPage = (edge) => {
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
};

const constructPrevNextObject = (post) => {
	return {
		title: post.node.frontmatter.title,
		slug: post.node.fields.slug,
	};
};

const findPrev = (posts, startIndex, sourceInstanceName) => {
	let i = startIndex - 1;
	while (i >= 0) {
		const post = posts[i];
		if (
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i--;
	}
	return null;
};

const findNext = (posts, startIndex, sourceInstanceName) => {
	let i = startIndex + 1;
	while (i < posts.length) {
		const post = posts[i];
		if (
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i++;
	}
	return null;
};

exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions;
	return graphql(`
		{
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___date] }
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
	`).then((result) => {
		if (result.errors) {
			result.errors.forEach((e) => console.error(e.toString()));
			return Promise.reject(result.errors);
		}
		const posts = result.data.allMarkdownRemark.edges;
		posts.forEach((edge, index, array) => {
			const id = edge.node.id;
			if (hasPage(edge)) {
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
	});
};
exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions;
	if (node.internal.type === `MarkdownRemark`) {
		const { sourceInstanceName } = getNode(node.parent);
		const relativePath = createFilePath({
			node,
			getNode,
			trailingSlash: false,
		});
		createNodeField({
			name: `slug`,
			node,
			value: `/${sourceInstanceName}${relativePath}`,
		});
		createNodeField({
			name: `sourceInstanceName`,
			node,
			value: sourceInstanceName,
		});
	}
};

exports.onCreateWebpackConfig = (
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
					localIdentName: '[local]',
				},
			}),
			loaders.postcss({ plugins: postCssPlugins }),
		].filter(Boolean),
	};

	if (useResolveUrlLoader && !isSSR) {
		sassRule.use.push({
			loader: `resolve-url-loader`,
			options: useResolveUrlLoader.options
				? useResolveUrlLoader.options
				: {},
		});
		sassRuleModules.use.push({
			loader: `resolve-url-loader`,
			options: useResolveUrlLoader.options
				? useResolveUrlLoader.options
				: {},
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
	});
};
