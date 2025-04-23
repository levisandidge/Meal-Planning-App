// AddRecipeForm.js
import React from "react";
import { useForm } from "react-hook-form";
import "./AddRecipeForm.css";

export default function AddRecipeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const recipeName = watch("recipeName");
  const ingredients = watch("ingredients");
  const instructions = watch("instructions");
  const author = watch("author");

  const onSubmit = (data) => {
    const mutations = {
      create: {
        _type: "document",
        recipeName,
        picture: null,
        ingredients,
        instructions,
        source: author,
      },
    };

    fetch(
      `https://${process.env.SANITY_TOKEN}.api.sanity.io/v2025-3-18/data/mutate/production?dryRun=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GATSBY_SANITY_MUTATION_TOKEN}`,
        },
        body: JSON.stringify({ mutations }),
      },
    );
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="recipeName">Recipe Name</label>
        <input
          id="recipeName"
          className="form-input"
          {...register("recipeName", { required: "Recipe name is required" })}
        />
        {errors.recipeName && <span>{errors.recipeName.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="ingredients">Ingredients</label>
        <textarea
          id="ingredients"
          className="form-textarea"
          placeholder="List ingredients, one per line"
          {...register("ingredients", { required: "Ingredients are required" })}
        />
        {errors.ingredients && <span>{errors.ingredients.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          className="form-textarea"
          {...register("instructions")}
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Source / Author</label>
        <input
          id="author"
          className="form-input"
          placeholder="Your name or source"
          {...register("author")}
        />
      </div>

      <button type="submit" className="form-button">
        Add Recipe
      </button>
    </form>
  );
}
