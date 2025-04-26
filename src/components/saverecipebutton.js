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
    const [isRemoving, setIsRemoving] = useState(false);
    const [status, setStatus] = useState(null);
    const [savedEntryId, setSavedEntryId] = useState(null); // stores the ID of the saved entry
    const [errorMessage, setErrorMessage] = useState('');


    // Ensure recipeId is valid
    if(!recipeId) {
        console.error("SaveRecipeButton requires a 'recipeId' prop.");
        return <Button variant="danger" disabled>Error: No Recipe ID</Button>
    }

    const handleSaveClick = async () => {
        setStatus(null); // reset on click
        setErrorMessage(''); // reset error message
        setIsSaving(true); // disable button while saving

        if (!isAuthenticated) {
            loginWithRedirect({ appState: { returnTo: window.location.pathname } });
            setIsSaving(false);
            return;
        }

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

            const result = await response.json();
            
            const receivedSavedId = result?.savedrecipeId;

            console.log('API Save Response:', result);
            if (response.ok) { // Status 200 OK
                setStatus('saved');
                setSavedEntryId(receivedSavedId); // Store the ID returned by the API
                console.log('Save successful:', result);
            } else if (response.status === 409) { // already saved
                setStatus('saved'); // Treat as saved
                setSavedEntryId(receivedSavedId); // Store the ID returned by the API
                console.log('Recipe was already saved:', result);
            } else { // Other errors
                throw new Error(result.error || `HTTP error ${response.status}`);
            }
        } catch (error) {
            setStatus('error');
            console.error("Error saving recipe:", error);
            setErrorMessage(error.message || 'Failed to save recipe.');
        } finally {
            setIsSaving(false); // re-enable button after saving
        }
    };

    const handleRemoveClick = async () => {
        setStatus(null); // Reset status
        setErrorMessage('');
        setIsRemoving(true); // Indicate removal in progress

        console.log('handleRemoveClick triggered. isAuthenticated:', isAuthenticated, 'savedEntryId:', savedEntryId);
        if (!isAuthenticated || !savedEntryId) {
            console.error("Cannot remove: Not authenticated or missing savedEntryId.");
            setIsRemoving(false);
            return;
        }

        try {
            const accessToken = await getAccessTokenSilently({
                audience: process.env.GATSBY_AUTH0_AUDIENCE,
            });

            const response = await fetch('/api/remove-favorite-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                // Send the ID of the 'savedRecipe' document to be deleted
                body: JSON.stringify({ savedRecipeId: savedEntryId }), 
            });

             // Check response status
            if (response.ok || response.status === 204) { // Handle 200 OK or 204 No Content
                 setStatus(null); // Reset to initial state
                 setSavedEntryId(null); // Clear the saved ID
                 console.log('Remove successful');
             } else {
                 const result = await response.json(); // Try to get error from body
                 throw new Error(result.error || `HTTP error ${response.status}`);
             }

        } catch (error) {
            console.error("Error removing recipe:", error);
            setStatus('error');
            setErrorMessage(error.message || 'Failed to remove recipe.');
        } finally {
            setIsRemoving(false);
        }
    };

    // Determine button text based on state
    let buttonToRender;

    if (isAuthLoading) {
        buttonToRender = <Button variant="secondary" disabled size="lg">Loading...</Button>;
    } else if (status === 'saved') {
        buttonToRender = (
            <Button
                variant="danger"
                onClick={handleRemoveClick}
                disabled={isRemoving}
                title="Remove this recipe from your saved list"
                size="lg"
            >
                {isRemoving ? 'Removing...' : 'Remove Recipe'}
            </Button>
        )
    } else {
        let saveButtonText = 'Save Recipe';
        let saveButtonVariant = 'primary';
        let saveButtonDisabled = isSaving;

        if (isSaving) {
            saveButtonText = 'Saving...';
        } else if (status === 'error') {
            saveButtonText = 'Error Saving';
            saveButtonVariant = 'warning';
        }

        buttonToRender = (
            <Button
                variant={saveButtonVariant}
                onClick={handleSaveClick}
                disabled={saveButtonDisabled || !isAuthenticated}
                title={!isAuthenticated ? "Log in to save recipes" : "Save this Recipe"}
                size="lg"
            >
                {saveButtonText}
            </Button>
        );
    }

    return (
        <div>
            {buttonToRender}
            {status === 'error' && <p className="text-danger mt-2">{errorMessage}</p>}
        </div>
    );
};

export default SaveRecipeButton;