import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

const SaveRecipeButton = ({ recipeId }) => {
    const {
        user,
        isAuthenticated,
        isLoading: isAuthLoading,
        loginWithRedirect,
        getAccessTokenSilently,
    } = useAuth0();


    // State to manage the button's saving process
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    // Ensure recipeId is valid
    if(!recipeId) {
        console.error("SaveRecipeButton requires a 'recipeId' prop.");
        return <Button variant="danger" disabled>Error: No Recipe ID</Button>
    }

    const handleSaveClick = async () => {
        setSaveStatus(null); // reset on click

        if (!isAuthenticated) {
            const confirmLogin = window.confirm("You need to log in to save recipes. Do you want to log in?");
            if (confirmLogin) {
                loginWithRedirect({ appState: { returnTo: window.location.pathname } });
            }
            return;
        }

        setIsSaving(true); // disable button while saving

        try {
            console.log("Client Save: Requesting token with audience:", process.env.GATSBY_AUTH0_AUDIENCE);
            const accessToken = await getAccessTokenSilently({
                audience: process.env.GATSBY_AUTH0_AUDIENCE,
                scope: "read:recipes",
            });
            console.log("Client Save: Access token obtained:", accessToken);
            if (!accessToken) {
                throw new Error("Failed to retrieve ID token.");
            }

            const response = await fetch('/api/save-favorite-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ recipeId: recipeId }),
            });

            if (response.status === 409) {
                setSaveStatus('already-saved');
                console.log('Recipe already saved by user');
           } else if (!response.ok) {
                // Try to get error message from response body
                let errorMsg = `HTTP error status: ${response.status}`;
                try {
                   const result = await response.json();
                   errorMsg = result.error || errorMsg;
                } catch (e) { /* Ignore if response body is not JSON */ }
                throw new Error(errorMsg);
           } else {
               // Success
               const result = await response.json(); // Process success response if needed
               setSaveStatus('success');
               console.log('Save response:', result);
           }
        } catch (error) {
            setSaveStatus('error');
            console.error("Error saving recipe:", error);
        } finally {
            setIsSaving(false); // re-enable button after saving
        }
    };

    // Determine button text based on state
    let buttonText = 'Save Recipe';
    let buttonVariant = 'primary';

    if (isSaving) {
        buttonText = 'Saving...';
    } else if (saveStatus === 'success') {
        buttonText = 'Saved!';
        buttonVariant = 'success';
    } else if (saveStatus === 'already_saved') {
        buttonText = 'Already Saved';
        buttonVariant = 'info';
    } else if (saveStatus === 'error') {
        buttonText = 'Error Saving'; // Or revert to 'Save Recipe' after a delay
        buttonVariant = 'danger';
    }

    const isDisabled = isAuthLoading || isSaving;
    const titleText = !isAuthenticated ? "Log in to save recipes" : (isSaving ? "Saving in progress" : "Save this Recipe");

    return (
        <Button
            variant={buttonVariant}
            onClick={handleSaveClick}
            disabled={isDisabled}
            title={titleText}
            size = 'lg'
        >
            {buttonText}
        </Button>
    );
};

export default SaveRecipeButton;