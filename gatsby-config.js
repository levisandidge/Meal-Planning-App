require("dotenv").config({
  path: `./.env`,
});

const token = process.env.PROJECT_ID;

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
        projectId: process.env.PROJECT_ID,
        dataset: "production",
        graphqlTag: "default",
        watchMode: true,
        apiVersion: "2025-3-18",
      },
    },
    `gatsby-plugin-image`,
  ],
};
