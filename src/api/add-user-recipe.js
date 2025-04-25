import { createClient } from '@sanity/client';
import * as jose from 'jose';
import { nanoid } from 'nanoid';

// Setup sanity client config
const sanityClient = createClient({
    projectId: process.env.PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    token: process.env.SANITY_WRITE_TOKEN,
    useCdn: false, // Recommended for serverless functions needing fresh data
    apiVersion: '2023-10-01', // Use a recent API version
});

const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0Audience = process.env.AUTH0_AUDIENCE;

if (!auth0Domain || !auth0Audience) {
    console.error('Auth0 domain or audience is not set in environment variables.');
}

const jwksUri = `https://${auth0Domain}/.well-known/jwks.json`;
const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

// helper function to parse ingredients
// takes raw strign and returns array format for Sanity
function parseIngredients(ingredientsString) {
    if (!ingredientsString || typeof ingredientsString !== 'string') {
        return [];
    }
    return ingredientsString
        .split('\n')
        .map(line => line.trim()) // trim whitespace
        .filter(line => line.length > 0) // remove empty lines
        .map(line => ({
            _key: nanoid(), //generate a unique key for each ingredient
            _type: 'ingredient',
            ingredient: line,
        }));
}

// Gatsby function handler
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // extract token from authorization header
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        let payload;
        try {
            const { payload: verifiedPayload } = await jose.jwtVerify(token, JWKS, {
                issuer: `https://${auth0Domain}/`,
                audience: auth0Audience,
            });
            payload = verifiedPayload;
            console.log('API Add: Auth0 Token Verified. User Sub:', payload.sub);
        } catch (error) {
            console.error('API Add: Auth0 Token Verification Error:', error.message);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        const userId = payload.sub;
        if (!userId) {
            return res.status(401).json({ error: 'User ID (sub) not found in token.' });
        }

        // get recipe data from request body
        const { name, ingredients, instructions, source } = req.body;

        // input validation
        if (!name || !ingredients) {
            return res.status(400).json({ error: 'Recipe name and ingredients are required.' });
        }

        // Prepare recipe data for Sanity
        const newRecipeDoc = {
            _type: 'recipes',
            userId: userId,
            name: name,
            ingredients: parseIngredients(ingredients),
            instructions: instructions || '',
            source: source || '',
            // picture:
        };

        // sanity operation
        console.log('API AddRecipe: Creating new recipe document:', newRecipeDoc);
        const createdRecipe = await sanityClient.create(newRecipeDoc);
        console.log('API AddRecipe: Created recipe document:', createdRecipe._id);
        
        return res.status(200).json({
            message: 'Recipe added and automatically saved.',
            recipeId: createdRecipe._id,
            savedRecipeId:createdSavedEntry._id,
        });
    } catch (error) {
        console.error('API AddRecipe: Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}