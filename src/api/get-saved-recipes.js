import { createClient } from '@sanity/client';
import * as jose from 'jose';


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
    // Log errors on the server
    console.error('Auth0 domain or audience is not set in environment variables.');
}

const jwksUri = `https://${auth0Domain}/.well-known/jwks.json`;
const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

// gatsby function handler
export default async function handler(req, res) {
    // This endpoint is for GETTING data
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        // extract token from authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        console.log('API: Extracted token string (length ' + token.length + '):', token);

        let payload;
        try {
            console.log('API: Verifying token with Auth0 JWKS...');
            const { payload: verifiedPayload } = await jose.jwtVerify(token, JWKS, {
                issuer: `https://${auth0Domain}/`,
                audience: auth0Audience,
            });
            payload = verifiedPayload;
            console.log('API: Auth0 Token Verified. User Sub:', payload.sub);
        } catch (error) {
            console.error('API: Auth0 Token Verification Error:', error.message);
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }

        // extract user ID from verified token
        const userId = payload.sub;
        if (!userId) {
            console.error('API: User ID (sub) not found in token.');
            return res.status(401).json({ error: 'User ID could not be determined from token.' });
        }

        // query for saved recipes
        // Fetch 'savedRecipe' documents for the user and expand the referenced recipe data
        const query = `*[_type == "savedRecipe" && userId == $userId] {
            _id, 
            savedAt,
            recipe-> {
                _id,
                name,
                instructions,
                source,
                ingredients[]{
                    ingredient,
                    measurement,
                    price
                },
                picture {
                    asset-> {
                        url
                    }
                }
            }
        }`;
        const params = { userId };

        console.log(`API: Fetching saved recipes from Sanity for user ${userId}`);
        const savedRecipeEntries = await sanityClient.fetch(query, params);

        // Filter out any potential null values if a reference was broken
        const savedRecipes = savedRecipeEntries
                                .map(entry => entry.recipe)
                                .filter(recipe => recipe !== null);

        console.log(`API: Found ${savedRecipes.length} saved recipes for user ${userId}`);

        // return success response with saved recipes
        // Send the array of recipe objects back to the client
        return res.status(200).json(savedRecipes);

    } catch (error) {
        console.error('API: Error in get-saved-recipes function:', error);
        // Avoid leaking internal details in production response
        return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
}