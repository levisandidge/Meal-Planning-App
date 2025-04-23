import React, {useState, useEffect} from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout.js'
import * as styles from '../styles/template.module.scss'


const convertToGrams = (measurement) => {
  // Simple example: extract number if measurement ends with 'g'
  const match = measurement.match(/([\d.]+)\s*g/i);
  if (match) {
    return parseFloat(match[1]);
  }
  // TODO: Add more conversion logic for cups, tbsp, etc.
  return null; // or default weight
};

const RecipePage = ({ data, pageContext }) => {
  const recipe = data.sanityRecipes;
  const [dataNotFound, setDataNotFound] = useState(false);
  const [totalNutrients, setTotalNutrients] = useState({});
  const { nutrientsData } = pageContext;

  console.log('Page context:', pageContext);
  console.log('Nutrients data:', nutrientsData);

  useEffect(() => {
    if (!recipe || !nutrientsData) return;

    // Nutrients to track
    const nutrientNames = ['Energy', 'Protein', 'Total lipid (fat)', 'Carbohydrate, by difference'];

    // Initialize totals
    const totals = {};
    nutrientNames.forEach(name => totals[name] = 0);
    
    let foundData = false

    recipe.ingredients.forEach(ingredient => {
      const weight = convertToGrams(ingredient.measurement);
      if (!weight) return; // skip if no valid weight

      const nutrientInfo = nutrientsData[ingredient.fdcid];
      if (!nutrientInfo) return;
      foundData = true

      nutrientInfo.foodNutrients
        .filter(n =>
          (n.nutrient?.name === 'Energy' && (n.nutrient?.unitName === 'kcal' || n.nutrient?.unitName === 'Cal')) ||
          ['Protein', 'Total lipid (fat)', 'Carbohydrate, by difference'].includes(n.nutrient?.name)
        )
        .forEach(nutrient => {
          const name = nutrient.nutrient.name;
          const amountPer100g = nutrient.amount;
          const amountForIngredient = amountPer100g * (weight / 100);
          totals[name] += amountForIngredient;
        });
    });

    setTotalNutrients(totals);
    setDataNotFound(!foundData);
  }, [recipe, nutrientsData]);

  if (!recipe) {
    return <Layout><div>Recipe not found</div></Layout>;
  };


  return (
    <Layout>
    <div className='mr-3'>
      <h1 className='mt-5 pt-5'>{recipe.name}</h1>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <>
          <li key={index}>
            {ingredient.ingredient} - {ingredient.measurement}
            {ingredient.price ? ` - $${ingredient.price}` : ''}
          {/*   {nutrientsData[ingredient.fdcid] && (
                <div className='mt-2 ml-3 p-2 bg-light rounded'>
                  <h6>Nutritional Information:</h6>
                  <ul className='list-unstyled'>
                    {nutrientsData[ingredient.fdcid]?.foodNutrients?.filter(n => 
                      ['Energy', 'Protein', 'Total lipid (fat)', 'Carbohydrate, by difference'].includes(n.nutrient?.name)
                    ).map((nutrient, i) => (
                      <li key={i}>
                        {nutrient.nutrient?.name}: {nutrient?.amount} {nutrient.nutrient?.unitName}
                      </li>
                    ))}
                  </ul>

                  
                </div>
              )} */}
          </li>
          </>
        ))}
      </ul>
      <div className='mt-4 mx-2 p-3 border rounded'>
        {dataNotFound ? (
          <p>Nutrient data not found for this recipe</p>
        ) : (
          <>
            <h5>Total Nutritional Information for Meal:</h5>
            <ul>
              {Object.entries(totalNutrients).map(([name, amount]) => (
                <li key={name}>
                  {name}: {amount.toFixed(2)} {nutrientsData[recipe.ingredients[0]?.fdcid]?.foodNutrients.find(n => n.nutrient?.name === name)?.nutrient?.unitName || ''}
                </li>
              ))}
            </ul>
            <p className="text-muted">Note: This is an approximation of the nutritional value and may be incorrect.</p>
        </>
        )}
      </div>
      <p className='mx-2'>{recipe.instructions}</p>
      <p>Source: {recipe.source}</p>
    </div>
    </Layout>
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
        fdcid
      }
    }
  }
`;

export default RecipePage;