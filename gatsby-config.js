require("dotenv").config({
  path: `./src/.env`,
});

const token = process.env.SANITY_TOKEN;

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `PlateItUp`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-sanity",
      options: {
        projectId: process.env.GATSBY_SANITY_PROJECT_ID,
        dataset: "production",
        graphqlTag: "default",
        watchMode: true,
        apiVersion: "2025-3-18",
      },
    },
    `gatsby-plugin-image`,
  ],
};
