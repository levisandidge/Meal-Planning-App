import { graphql, Link } from "gatsby"
import * as React from 'react';

const recipesPage = ({data}) => {

  return (
    <>
      <h1>Recipe Page</h1>
      <div>
        {data.allSanityRecipes.nodes.map((node) => (
          <div key={node._id}>
            <h2>
              <Link to={`/recipes/${node.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {node.name}
              </Link>
            </h2>
            <ul>
              {node.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.ingredient} - {ingredient.measurement} - ${ingredient.price}
                </li>
              ))}
            </ul>
            <p>{node.instructions}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export const query = graphql`
    query M {
        allSanityRecipes {
            nodes {
            ingredients{
                ingredient
                measurement
                price
            }
            instructions
            name
            source
            _id
            }
        }
    }
`
export default recipesPage;

