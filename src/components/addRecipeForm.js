// AddRecipeForm.jsx
import React from "react";
import { FormRenderer } from "@sanity/form-toolkit/form-schema";
import sanityClient from "@sanity/client";

// Configure the Sanity client (ensure your token has minimal write permissions)
const client = sanityClient({
  projectId: "2ziz6el5", // Replace with your actual project ID
  dataset: "production", // For example: 'production'
  token:
    "skJ8IL4ZNctYstBQ6wCCgXAP9ICJMGNQ5NEryfdiqKa2CBCW11U0TWX1mWBWkyvtpRk3FBNY7e8PabLbsteyfjHvsOGfwaw94oR6NW4P7zCzNp6G5g6kOyPI0NS1HVSZla2EhUtq1S8KRJ42i1lppzyssmKaliefko0AcjBLcDzPoGxMqamo", // Use a token with restricted (create-only) permissions
  useCdn: false, // Use false for write operations
});

// Define the recipe form schema to mirror your Sanity document schema.
const recipeFormSchema = {
  title: "Recipe",
  type: "object",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Recipe Name",
    },
    {
      name: "picture",
      type: "image",
      title: "Picture",
    },
    {
      name: "ingredients",
      type: "array",
      title: "Ingredients",
      of: [
        {
          type: "object",
          name: "ingredient",
          title: "Ingredient",
          fields: [
            {
              name: "name",
              type: "string",
              title: "Ingredient Name",
            },
          ],
        },
      ],
    },
    {
      name: "instructions",
      type: "string",
      title: "Instructions",
    },
    {
      name: "source",
      type: "string",
      title: "Source",
    },
  ],
};

const AddRecipeForm = () => {
  // The submit handler is called with the form values when the form is submitted.
  const handleSubmit = async (values) => {
    try {
      // If a picture is provided and it is a File or Blob, upload it as an asset.
      if (
        values.picture &&
        (values.picture instanceof File || values.picture instanceof Blob)
      ) {
        const asset = await client.assets.upload("image", values.picture);
        // Replace the picture field with an image reference object as expected by Sanity.
        values.picture = {
          _type: "image",
          asset: {
            _ref: asset._id,
            _type: "reference",
          },
        };
      }

      // Create the recipe document in Sanity (ensuring that _type matches your schema)
      const createdDoc = await client.create({
        ...values,
        _type: "recipes",
      });

      alert("Recipe submitted successfully! ID: " + createdDoc._id);
      return createdDoc;
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Error submitting recipe: " + error.message);
      throw error;
    }
  };

  return (
    <div>
      <h1>Submit Your Recipe</h1>
      <FormRenderer
        schema={recipeFormSchema}
        initialvalue={{}}
        onSubmit={handleSubmit}
        // Optional: custom footer if needed; here we return null.
        renderfooter={() => null}
        // Custom renderButton to display a submit button.
        renderbutton={(props) => <button {...props}>Submit Recipe</button>}
      />
    </div>
  );
};

export default AddRecipeForm;
