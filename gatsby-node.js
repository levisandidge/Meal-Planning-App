const path = require(`path`)

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`, // this will pick up .env.development when you run `gatsby develop`
});

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Your Gatsby site has been built!`)
}


exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
  
    // Fetch all recipes
    const result = await graphql(`
    query {
      allSanityRecipes {
        nodes {
          _id
          name
          ingredients {
            fdcid
          }
        }
      }
    }
    `);
    if (result.errors) throw result.errors;

    const allFdcIds = [];
    result.data.allSanityRecipes.nodes.forEach(recipe => {
      //handle recipes that might not have ingredients
      if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
          if (ingredient.fdcid && !allFdcIds.includes(ingredient.fdcid)) {
            allFdcIds.push(ingredient.fdcid);
          }
        });
      }
    });


    const batchResponses = await fetch(`https://api.nal.usda.gov/fdc/v1/foods?fdcIds=${allFdcIds.join(',')}&api_key=${process.env.GATSBY_USDA_API_KEY}`)
    const batchData = await batchResponses.json();

    const nutrientsMap = {};
    
    // Check if response is an array
    if (Array.isArray(batchData)) {
      batchData.forEach(food => {
        if (food.fdcId) {
          nutrientsMap[food.fdcId] = food;
        }
      });
    } 
    // Handle case where response might be an object
    else if (typeof batchData === 'object' && batchData !== null) {
      if (batchData.foods && Array.isArray(batchData.foods)) {
        batchData.foods.forEach(food => {
          if (food.fdcId) {
            nutrientsMap[food.fdcId] = food;
          }
        });
      } else if (batchData.fdcId) {
        // Handle single food response
        nutrientsMap[batchData.fdcId] = batchData;
      }
    }


    // Create pages for each recipe
    result.data.allSanityRecipes.nodes.forEach((node) => {

      const recipeNutrients = {};
      node.ingredients.forEach(ingredient => {
      if (ingredient.fdcid && nutrientsMap[ingredient.fdcid]) {
        recipeNutrients[ingredient.fdcid] = nutrientsMap[ingredient.fdcid];
        }
      });

      createPage({
        path: `/recipes/${node.name.toLowerCase().replace(/\s+/g, '-')}`, // Generate a URL slug
        component: path.resolve('./src/templates/recipeTemplate.js'),
        context: {
          id: node._id, 
          nutrientsData: recipeNutrients
        },
      });
    });
  };