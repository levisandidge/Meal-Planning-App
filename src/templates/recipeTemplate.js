import React from 'react';
import { graphql } from 'gatsby';

const RecipePage = ({ data }) => {
  const recipe = data.sanityRecipes;

  if (!recipe) {
    return <div>Recipe not found</div>;
  };
  return (
    <div>
      <h1>{recipe.name}</h1>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.ingredient} - {ingredient.measurement} - ${ingredient.price}
          </li>
        ))}
      </ul>
      <p>{recipe.instructions}</p>
      <p>Source: {recipe.source}</p>
    </div>
  );
};

export const query = graphql`
  query($id: String!) {
    sanityRecipes(_id: { eq: $id }) {
      _id
      name
      instructions
      source
      ingredients {
        ingredient
        measurement
        price
      }
    }
  }
`;

export default RecipePage;