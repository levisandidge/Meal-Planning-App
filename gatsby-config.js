/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `mealPlanner`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: ["gatsby-plugin-sass",
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: '2ziz6el5', 
        dataset: 'production',
        graphqlTag: 'default',
        watchMode: true,
        apiVersion: '2025-3-18',
      },
    },
    `gatsby-plugin-image`,
  ],
  
};

const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Fetch all recipes
  const result = await graphql(`
    {
      allSanityRecipes {
        nodes {
          _id
          name
        }
      }
    }
  `);

  // Create pages for each recipe
  result.data.allSanityRecipes.nodes.forEach((node) => {
    createPage({
      path: `/recipes/${node.name.toLowerCase().replace(/\s+/g, '-')}`, // Generate a URL slug
      component: path.resolve('./src/pages/recipeTemplate.js'),
      context: {
        node: node, 
      },
    });
  });
};