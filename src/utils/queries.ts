import { graphql } from 'gatsby';

/** Hack to get typegen for sitemap */
graphql`
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
	}
`;
