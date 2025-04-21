import { createClient } from '@sanity/client';
import * as jose from 'jose';

// Sanity client config
// Init sanity client with write permissions
const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    apiVersion: '2023-10-01', // Use the latest API version
});

// Auth0 Config
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;

if (!auth0Domain || !auth0Audience) {
    throw new Error('Auth0 domain or audience is not set in environment variables.');
}

// Construct JWKS url (Auth0 public key endpoint)
const jwksUri = 'https://' + auth0Domain + '/.well-known/jwks.json';
const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

// Gatsby Function handler
export default async function handler(req, res) {
    // Check http method
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method ${req.method} Not ALlowed'})
    }

    try {
        // Extract token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
        }
        const token = authHeader.substring(7);

        // Verify ID token
        let payload;
        try {
            const { payload: verifiedPayload } = await jose.jwtVerify(token, JWKS, {
                issuer: `https://${auth0Domain}/`,
                audience: auth0Audience,
            });
            payload = verifiedPayload;
            console.log('Auth0 Token Verified. User Sub:', payload.sub);
        } catch (error) {
            console.error('Auth0 Token Verification Error:', error.message);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // Extract user ID from verified token
        const userId = payload.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User ID (sub) not found in token.' });
        }

        // Get recipe data from request body
        const { recipeId } = req.body; // Expecting { "recipeId": "the original"}
        if (!recipeId || typeof recipeId !== 'string') {
            return res.status(400).json({ error: 'Recipe data missing or invalid in request body.' });
        }

        // Prepare recipe data for Sanity
        const savedRecipeDocument = {
            _type: 'savedRecipe',
            userId: userId,
            recipe: {
                _type: 'reference',
                _ref: recipeId,
            },
            savedAt: new Date().toISOString(),
        };

        // Check if the recipe already exists for the user
        const existingQuery = '*[_type == "savedRecipe" && userId == $userId && recipe._ref == $recipeId]';
        const exisitingParams ={ userId, recipeId };
        const existingSave = await sanityClient.fetch(existingQuery, exisitingParams);

        if (existingSave) {
            console.log('Recipe already exists for user:', userId);
            return res.status(409).json({ error: 'Recipe already saved!' });
            return res.status(200).json({ message: 'Receipe already saved!', savedRecipeId: existingSave._id });
        }

        // Write to sanity
        console.log('Attempting to save recipe ${recipeId} in Sanity for user ${userId}');
        const createdSavedRecipe = await sanityClient.create(savedRecipeDocument);
        console.log('Recipe saved successfully:', createdSavedRecipe._id);

        // Return success response
        return res.status(200).json({
            message: 'Recipe saved successfully!',
            recipeId: createdRecipe._id,
        });

        
    } catch (error) {
        console.error('Error in save-user-recipe function:', error);
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
}