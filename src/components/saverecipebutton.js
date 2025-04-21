import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from 'react-bootstrap/Button';

const SaveRecipeButton = ({ recipeId }) => {
    const {
        user,
        isAuthenticated,
        isLoading: isAuthLoading,
        loginWithRedirect,
        getIdTokenClaims,
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
            const claims = await getIdTokenClaims();
            const idToken = claims?.__raw; // get raw ID token

            if (!idToken) {
                throw new Error("Failed to retrieve ID token.");
            }

            const response = await fetch('/api/save-favorite-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ recipeId: recipeId }),
            });

            const result = await response.json();

            if (!response.ok) {
                // handle already saved error
                if (response.status === 409 || result.message === 'Recipe already saved!') {
                    setSaveStatus('already-saved');
                    console.log('Recipe already saved by user');
                } else {
                    throw new Error(result.error || 'HTTP error status: ${response.status}');
                }
            } else {
                // success
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