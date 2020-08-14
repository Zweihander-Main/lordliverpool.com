const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions;
	return graphql(`
		{
			allMarkdownRemark(limit: 1000) {
				edges {
					node {
						id
						fields {
							slug
							sourceInstanceName
						}
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
		posts.forEach((edge) => {
			const id = edge.node.id;
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
				},
			});
		});
	});
};
// TODO do we need relative images thing?
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
