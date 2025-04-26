import { createClient } from '@sanity/client';
import * as jose from 'jose';

const sanityClient = createClient({
    projectId: process.env.PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false,
    apiVersion: '2023-10-01',
});

const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;

if (!auth0Domain || !auth0Audience) {
    console.error('Auth0 domain or audience is not set in environment variables.');
    // You might throw an error here if preferred, but logging avoids breaking the build
}

const jwksUri = `https://${auth0Domain}/.well-known/jwks.json`;
const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

// Gatsby function handler
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // extract token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
        }
        const token = authHeader.substring(7);

        let payload;
        try {
            const { payload: verifiedPayload } = await jose.jwtVerify(token, JWKS, {
                issuer: `https://${auth0Domain}/`,
                audience: auth0Audience,
            });
            payload = verifiedPayload;
            console.log('API Remove: Auth0 Token Verified. User Sub:', payload.sub);
        } catch (error) {
            console.error('API Remove: Auth0 Token Verification Error:', error.message);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        const userId = payload.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User ID (sub) not found in token.' });
        }

        // get savedRecipeId from request body
        const { savedRecipeId } = req.body;
        // Check if savedRecipeId is present and valid
        if (!savedRecipeId || typeof savedRecipeId !== 'string') {
            return res.status(400).json({ error: 'Saved Recipe ID missing or invalid in request body.' });
        }

        // check if the savedRecipeId exists and belongs to the user
        const checkQuery = '*[_type == "savedRecipe" && _id == $savedRecipeId && userId == $userId][0]._id';
        const checkParams = { savedRecipeId, userId };

        console.log(`API Remove: Checking ownership for savedRecipeId: ${savedRecipeId} by user: ${userId}`);
        const ownedSavedRecipeId = await sanityClient.fetch(checkQuery, checkParams);

        if (!ownedSavedRecipeId) {
            // If the query returns null, either the ID doesn't exist or it doesn't belong to this user
            console.warn(`API Remove: Attempt to remove saved recipe failed. ID ${savedRecipeId} not found or not owned by user ${userId}.`);
            return res.status(404).json({ error: 'Saved recipe entry not found or access denied.' });
        }

        // If ownership confirmed (ownedSavedRecipeId matches savedRecipeId), proceed with delete
        console.log(`API Remove: Ownership confirmed. Deleting savedRecipeId: ${savedRecipeId}`);
        await sanityClient.delete(savedRecipeId);
        console.log(`API Remove: Successfully deleted savedRecipeId: ${savedRecipeId}`);

        // SUCCESS
        return res.status(200).json({ message: 'Recipe removed successfully.' });

    } catch (error) {
        console.error('API Remove: Error in remove-favorite-recipe function:', error);
        // Avoid leaking internal details
        return res.status(500).json({ error: 'Internal server error while removing recipe.' });
    }
}