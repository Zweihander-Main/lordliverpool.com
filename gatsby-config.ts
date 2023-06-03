import type { GatsbyConfig } from 'gatsby';
import util from 'util';
import { exec } from 'child_process';
const execProm = util.promisify(exec);

const siteUrl = 'https://www.lordliverpool.com/';

const title = 'Britain’s Greatest Prime Minister: Lord Liverpool';
const short_sub_name = 'Lord Liverpool';
const description =
	'Britain’s Greatest Prime Minister: Lord Liverpool unpicks two centuries of Whig history to redeem Lord Liverpool (1770-1828) from ‘arch-mediocrity’ and establish him as the greatest political leader the country has ever seen.';
const author = 'Martin Hutchinson';

async function getGitModifiedTime(
	absolutePath: string | null,
	curTime: string
): Promise<string> {
	if (!absolutePath) {
		return curTime;
	}
	const { stdout, stderr } = await execProm(
		`git log -1 --pretty=format:%aI -- ${absolutePath}`
	);
	if (stderr || !stdout) {
		return curTime;
	}
	return stdout;
}

function getFolderAndNormalizedFilename(path: string): {
	folder: string;
	filename: string;
} {
	const parts = path.split('/');
	const filenameWithExtension = parts.pop() || '';
	const filename = filenameWithExtension.split('.')[0];
	const folder = parts.join('/');

	return { folder, filename };
}

const config: GatsbyConfig = {
	siteMetadata: {
		title,
		description,
		author,
		siteUrl,
	},
	trailingSlash: 'ignore',
	graphqlTypegen: {
		typesOutputPath: 'src/gatsby-types.d.ts',
		generateOnBuild: true,
		documentSearchPaths: [
			'./gatsby-node.ts',
			'./plugins/**/gatsby-node.ts',
			'./src/utils/queries.ts',
		],
	},
	flags: {
		FAST_DEV: true,
		PARALLEL_SOURCING: true,
	},
	plugins: [
		'gatsby-plugin-perf-budgets',
		{
			resolve: 'gatsby-plugin-webpack-bundle-analyser-v2',
			options: {
				devMode: false,
				analyzerMode: 'static',
			},
		},
		{
			resolve: 'gatsby-plugin-typescript',
			options: {
				isTSX: true,
				allExtensions: true,
			},
		},
		{
			resolve: 'gatsby-plugin-typography',
			options: {
				pathToConfigModule: 'src/utils/typography.tsx',
				omitGoogleFont: true,
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'images',
				path: `${__dirname}/src/images`,
			},
		},
		'gatsby-plugin-remove-fingerprints',
		'gatsby-plugin-image',
		{
			resolve: 'gatsby-plugin-sharp',
			options: {
				defaults: {
					formats: ['auto', 'webp'],
					placeholder: 'dominantColor',
					quality: 50,
					breakpoints: [750, 1080, 1366, 1920],
					backgroundColor: 'transparent',
					tracedSVGOptions: {},
					blurredOptions: {},
					jpgOptions: {},
					pngOptions: {},
					webpOptions: {},
					avifOptions: {},
				},
			},
		},
		'gatsby-transformer-sharp',
		{
			resolve: 'gatsby-plugin-sitemap',
			options: {
				/* NOTE: types generated from repeated code in src/utils/queries.ts */
				query: `
					query sitemapInConfig {
						allSitePage {
							nodes {
								component
								path
							}
						}
						site {
							siteMetadata {
								siteUrl
							}
						}
						allMarkdownRemark {
							edges {
								node {
									fields {
										slug
										sourceInstanceName
									}
									fileAbsolutePath
								}
							}
						}
					}`,
				resolvePages: async (
					queryData: Queries.sitemapInConfigQuery
				) => {
					/* Logic: Use last git modified time for all pages. Base
					page on content markdown if available, most recent modified
					markdown for templates, or component in that order. Use
					current time as fallback. */
					const curTime = new Date().toISOString();

					const allPagesFromQuery = queryData.allSitePage.nodes;
					const allMarkdownNodesFromQuery =
						queryData.allMarkdownRemark.edges;
					const allMarkdownNodesWithGitTimes = await Promise.all(
						allMarkdownNodesFromQuery.map(async ({ node }) => {
							const { slug, sourceInstanceName } =
								node.fields as {
									slug: string;
									sourceInstanceName: string;
								};
							const { fileAbsolutePath } = node;
							const gitTime = await getGitModifiedTime(
								fileAbsolutePath,
								curTime
							);
							return {
								slug,
								sourceInstanceName,
								fileAbsolutePath,
								mtime: gitTime,
							};
						})
					);

					return await Promise.all(
						allPagesFromQuery.map(async (page) => {
							const component = page.component;
							const path = page.path;
							const normalizedPathObject =
								getFolderAndNormalizedFilename(path);
							const markdownNode =
								allMarkdownNodesWithGitTimes.find(
									(node) => node.slug === path
								);
							let mtime;
							if (markdownNode) {
								/* Regular markdown node */
								mtime = markdownNode.mtime;
							} else if (
								[
									'contenders',
									'chronology',
									'miscellany',
								].includes(normalizedPathObject.filename)
							) {
								/* The latest modified markdown node
								corresponding to this template index */
								mtime = allMarkdownNodesWithGitTimes
									.filter(
										(node) =>
											node.sourceInstanceName ===
											normalizedPathObject.filename
									)
									.sort(
										(a, b) =>
											parseInt(b.mtime, 10) -
											parseInt(a.mtime, 10)
									)[0].mtime;
							} else {
								/* Non-markdown, non-template index regular page
								uses component modified time */
								mtime = await getGitModifiedTime(
									component,
									curTime
								);
							}
							if (mtime) {
								return {
									...page,
									mtime: new Date(mtime).toISOString(),
								};
							} else {
								return { ...page, mtime: curTime };
							}
						})
					);
				},
				serialize: ({
					path,
					mtime,
				}: {
					path: string;
					mtime: string;
				}) => {
					return {
						url: path,
						lastmod: mtime,
					};
				},
				resolveSiteUrl: () => siteUrl,
			},
		},
		{
			resolve: 'gatsby-plugin-robots-txt',
			options: {
				sitemap: `${siteUrl}sitemap-index.xml`,
				policy: [{ userAgent: '*', allow: '/' }],
			},
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: title,
				short_name: short_sub_name,
				start_url: '/',
				lang: 'en',
				background_color: '#260101',
				theme_color: '#260101',
				display: 'minimal-ui',
				icon: 'src/images/bgpmicon.png', // This path is relative to the root of the site.
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/miscellany`,
				name: 'miscellany',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/chronology`,
				name: 'chronology',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/contenders`,
				name: 'contenders',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/pages`,
				name: 'pages',
			},
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: `${__dirname}/content/retailers`,
				name: 'retailers',
			},
		},
		'gatsby-transformer-remark',
		'gatsby-plugin-catch-links',
		'gatsby-plugin-netlify',
		'gatsby-plugin-netlify-cms', // should be last in the array or close to it
	],
};

export default config;
