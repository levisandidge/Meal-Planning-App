// AddRecipeForm.js

import React from "react";
import { useForm } from "react-hook-form";

const projectId = process.env.GATSBY_SANITY_PROJECT_ID;
const datasetName = "production";
const token = process.env.GATSBY_SANITY_MUTATION_TOKEN;

export default function AddRecipeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const mutations = {
      create: {
        _type: "document",
        recipeName: recipeName,
        picture: null,
        ingredients: ingredients,
        instrucionts: instructions,
        source: author,
      },
    };

    fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${datasetName}?dryRun=true`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mutations }),
      },
    );
  };

  const recipeName = watch("recipeName"); // watch input value by passing the name of it
  const ingredients = watch("ingredients");
  const instructions = watch("instructions");
  const author = watch("author");

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input {...register("recipeName", { required: true })} />

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("ingredients", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input {...register("instructions")} />

      <input {...register("author")} />

      <input type="submit" />
    </form>
  );
}
