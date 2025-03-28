import { graphql, Link } from "gatsby"
import * as React from 'react';
import {useState} from 'react'
import * as styles from '../styles/recipes.module.scss'
const DEFAULT_IMAGE_URL = "https://via.placeholder.com/150";


const RecipesPage = ({data}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allRecipes = data.allSanityRecipes.nodes;

  const filteredRecipes = allRecipes.filter(recipe => 
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ing => 
      ing.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container py-5">
      <h1 className="mb-4">Recipe Page</h1>
      
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search recipes or ingredients..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRecipes.length === 0 ? (
        <p>No recipes found matching "{searchTerm}"</p>
      ) : (
        <div className="row g-4">
          {filteredRecipes.map((node) => 
            <div key={node._id} className="col-md-6 col-lg-4">
              <div className="card h-100">
                <Link to={`/recipes/${node.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-decoration-none"
                    >
                  <div className={`${styles.recipeImage}card-body h-100`}
                    style={{ backgroundImage: `url(${node.picture?.asset?.url || DEFAULT_IMAGE_URL})` }}>
                  <h2 className="card-title h5">
                      {node.name}
                    </h2>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
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
            picture{
                asset{
                  url
                }
              }
            }
        }
    }
`
export default RecipesPage;

