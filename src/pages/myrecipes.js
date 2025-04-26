import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "gatsby";
import { useAuth0 } from "@auth0/auth0-react";
import * as styles from "../styles/recipes.module.scss";
import Layout from "../components/layout.js";

const DEFAULT_IMAGE_URL = "https://via.placeholder.com/150";

// No more GraphQL query needed here for the main data

const RecipesPage = () => {
  // Remove the 'data' prop
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading, // Renamed to avoid conflict
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // State for data loading
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Function to fetch saved recipes
    const fetchSavedRecipes = async () => {
      if (!isAuthenticated) {
        setIsLoadingData(false); // Stop loading if not authenticated
        console.log("User not authenticated. Cannot fetch saved recipes.");
        return;
      }

      setIsLoadingData(true); // Start loading data
      setError(null); // Reset error state

      try {
        console.log("Attempting to get access token...");
        const token = await getAccessTokenSilently({
          audience: process.env.GATSBY_AUTH0_AUDIENCE, // Ensure audience is available client-side
          scope: "read:saved_recipes", // Example scope if you defined one
        });
        console.log("Access token obtained:", token);

        // Basic check if it looks like a token
        if (typeof token !== "string" || !token.includes(".")) {
          console.warn("Client: The obtained value doesn't look like a token!");
        }

        console.log("Fetching saved recipes from API...");
        const response = await fetch("/api/get-saved-recipes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! Status: ${response.status}`,
          );
        }

        const recipes = await response.json();
        console.log("Saved recipes fetched:", recipes);
        setSavedRecipes(recipes);
      } catch (err) {
        console.error("Failed to fetch saved recipes:", err);
        setError(
          err.message || "An error occurred while fetching your saved recipes.",
        );
      } finally {
        setIsLoadingData(false); // Stop loading regardless of outcome
      }
    };

    // Only fetch if Auth0 is no longer loading and the user is authenticated
    if (!isAuthLoading) {
      fetchSavedRecipes();
    }

    // Dependency array: Re-run effect if Auth0 loading state or authentication state changes
  }, [isAuthenticated, isAuthLoading, getAccessTokenSilently]);

  // Filter recipes based on search term - useMemo for optimization
  const filteredRecipes = useMemo(() => {
    if (!searchTerm) {
      return savedRecipes; // Return all saved recipes if no search term
    }
    return savedRecipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.ingredients &&
          recipe.ingredients.some(
            (
              ing, // Check if ingredients exist
            ) =>
              ing.ingredient &&
              ing.ingredient.toLowerCase().includes(searchTerm.toLowerCase()),
          )),
    );
  }, [savedRecipes, searchTerm]); // Recalculate only when savedRecipes or searchTerm changes

  // Handle Auth0 loading state
  if (isAuthLoading) {
    return (
      <Layout>
        <div className="container py-5">
          <p>Loading authentication...</p>
        </div>
      </Layout>
    );
  }

  // Handle Not Authenticated state
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <h1 className={`my-4 ${styles.header}`}>My Saved Recipes</h1>
          <p>Please log in to see your saved recipes.</p>
          <button
            className="btn btn-primary"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
        </div>
      </Layout>
    );
  }

  // Handle Data Loading State
  if (isLoadingData) {
    return (
      <Layout>
        <div className="container py-5">
          <p>Loading your saved recipes...</p>
        </div>
      </Layout>
    );
  }

  // Handle Error State
  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <p className="text-danger">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  // Main Content - Display Saved Recipes
  return (
    <Layout>
      <div className="container py-5">
        <h1 className={`my-4 ${styles.header}`}>My Saved Recipes</h1>

        {/* Search Bar - only show if there are recipes */}
        {savedRecipes.length > 0 && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search your saved recipes by name or ingredient..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Conditional Rendering based on filtering results */}
        {savedRecipes.length === 0 ? (
          <p>You haven't saved any recipes yet!</p>
        ) : filteredRecipes.length === 0 ? (
          <p>No saved recipes found matching "{searchTerm}"</p>
        ) : (
          <div className="row g-4">
            {filteredRecipes.map(
              (
                recipe, // Map over filteredRecipes
              ) =>
                // Ensure recipe and recipe._id exist before rendering
                recipe && recipe._id ? (
                  <div key={recipe._id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <Link
                        // Link to the recipe detail page using its name/slug
                        to={`/recipes/${recipe.name.toLowerCase().replace(/\s+/g, "-")}`}
                        key={recipe._id} // Key on the Link can be helpful too
                        className={styles.recipeButton} // Use your existing styles
                      >
                        <div
                          className={styles.recipeImage}
                          style={{
                            backgroundImage: `url(${recipe.picture?.asset?.url || DEFAULT_IMAGE_URL})`,
                          }}
                        ></div>
                        {/* Make sure recipe name exists */}
                        <span className="recipe-name">
                          {recipe.name || "Untitled Recipe"}
                        </span>
                      </Link>
                      {/* Keep the card structure if needed, or simplify */}
                    </div>
                  </div>
                ) : null, // Render nothing if recipe or recipe._id is somehow missing
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecipesPage;
