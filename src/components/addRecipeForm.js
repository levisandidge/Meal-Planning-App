// AddRecipeForm.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth0 } from "@auth0/auth0-react";
import "./AddRecipeForm.css";

export default function AddRecipeForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Auth0 hook
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  // state for loading and feedback
  const[isSubmitting, setIsSubmitting] = useState(false);
  const[submitStatus, setSubmitStatus] = useState({ message: '', type: '' }); // type: success or error

  // REMOVED OLD WATCHED VALUES, NOT NEEDED ANYMORE

  const onSubmit = async (data) => {
    // set submitting state
    setIsSubmitting(true);
    setSubmitStatus({ message: '', type: '' }); // clear previous status

    // Check if user is authenticated
    if (!isAuthenticated) {
      alert("Please log in to add a recipe.");
      loginWithRedirect({ appState: { returnTo: window.location.pathname } }); // trigger login
      setIsSubmitting(false);
      return;
    }

    try {
      // get Auth0 token
      const accessToken = await getAccessTokenSilently({
        audience: process.env.GATSBY_AUTH0_AUDIENCE,
      });

      // UTILIZE FormData INSTEAD OF JSON
      const formData = new FormData();
      formData.append('name', data.recipeName);
      formData.append('ingredients', data.ingredients);
      formData.append('instructions', data.instructions);
      formData.append('source', data.author);

      if (data.picture && data.picture.length > 0) {
        formData.append('picture', data.picture[0]); // Assuming picture is a file input

      }
      // REPLACED OLD FETCH CALL WITH BACKEND API (add-user-recipe.js)
      const response = await fetch('/api/add-user-recipe', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData, // SENDING FORMDATA INSTEAD OF JSON
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add recipe (${response.status})');
      }

      // SUCCESS
      console.log('Recipe added via API:', result);
      setSubmitStatus({ message: 'Recipe added successfully!', type: 'success' });
      reset(); // reset form fields
    } catch (error) {
      console.error('Error adding recipe:', error);
      setSubmitStatus({ message: 'Failed to add recipe. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false); // renable button
    }
    // REMOVED OLD MUTATION CODE, NOT NEEDED ANYMORE
    // REMOVED FETCH CALL TO SANITY, NOT NEEDED ANYMORE
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="recipeName">Recipe Name</label>
        <input
          id="recipeName"
          className="form-input"
          {...register("recipeName", { required: "Recipe name is required" })}
          disabled={isSubmitting} // disable input while submitting
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
          disabled={isSubmitting} // disable input while submitting
        />
        {errors.ingredients && <span>{errors.ingredients.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          className="form-textarea"
          {...register("instructions")}
          disabled={isSubmitting} // disable input while submitting
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Source / Author</label>
        <input
          id="author"
          className="form-input"
          placeholder="Your name or source"
          {...register("author")}
          disabled={isSubmitting} // disable input while submitting
        />
      </div>

      <div className="form-group">
        <label htmlFor="picture">Recipe Picture</label>
        <input
          id="picture"
          type="file"
          className="form-input"
          accept="image/*"
          {...register("picture")}
          disabled={isSubmitting} // disable input while submitting
        />
        {errors.picture && <span>{errors.picture.message}</span>}
      </div>

      <div className="form-group">
        <button
          type = "submit"
          className="form-button"
          disabled={isAuthLoading || isSubmitting} // disable button while loading or submitting
        >
          {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
        </button>
      </div>

      {/* Display feedback message */}
      {submitStatus.message && (
        <p className={'feedback-message ${submitStatus.type}'}>
          {submitStatus.message}
        </p>
      )}
      {/* Display Auth0 login prompt if not authenticated */}
      {!isAuthLoading && !isAuthenticated && (
        <p className="login-prompt">
          Please <button type="button" onClick={() => loginWithRedirect()} className="link-button">log in</button> to add a recipe.
        </p>
      )}
    </form>
  );
}
