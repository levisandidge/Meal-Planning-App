// AddRecipeForm.js

import React from "react";
import { useForm } from "react-hook-form";
import createClient from "@sanity/client"; // adjust path if needed


export const sanity = createClient({
  projectId: process.env.GATSBY_SANITY_PROJECT_ID, // <‑‑ prefix required in Gatsby
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.GATSBY_SANITY_MUTATION_TOKEN, // write token (dev only)
  useCdn: false,
});

export default function AddRecipeForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()


  const onSubmit = (data) => fetch(`https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${datasetName}?dryRun=true`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${tokenWithWriteAccess}`
    },
    body: JSON.stringify({mutations})
  })


  console.log(watch("example")) // watch input value by passing the name of it


  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue="test" {...register("example")} />


      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}


      <input type="submit" />
    </form>
  )
}