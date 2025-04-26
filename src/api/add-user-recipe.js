import { createClient } from '@sanity/client';
import * as jose from 'jose';
import { nanoid } from 'nanoid';
import fs from "fs";

// FIX ME: I CAN'T GET THE FILE UPLOAD TO WORK FOR PICTURES
// FIX ME: ;bgWIPUEBGILRWBGI:WJBGIO:WGBgi;bguieghiuehg;eahbuge

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
    console.log('Handler Started');

    if (req.method !== 'POST') {
        console.log('Method not POST, exiting');
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    try {
        console.log('Parsing form data...');

        // extract file info
        let pictureFileObject = null;
        let tempFilePath = null;
        let originalFilename = null;
        let mimetype = null;

        if (req.files && req.files.picture) {
            pictureFileObject = Array.isArray(req.files.picture) ? req.files.picture[0] : req.files.picture;
            console.log('Picture file object found:', pictureFileObject);

            tempFilePath = pictureFileObject.filepath || pictureFileObject.path;
            originalFilename = pictureFileObject.originalFilename || pictureFileObject.name;
            mimetype = pictureFileObject.mimetype || pictureFileObject.type;

            if (!tempFilePath) {
                console.error('Error: picture file path missing');
            }
        } else {
            console.log('No picture key found in req.files');
        }

        const fields = req.body;
        if (!fields || Object.keys(fields).length === 0) {
            console.error('Error: req.body is empty or missing after defaul parsing.', fields);
        } else {
            console.log('Fields found in req.body:', Object.keys(fields));
        }

        // extract token from authorization header
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Auth header missing/invalid.');
            return res.status(401).json({ error: 'Authorization header is missing or invalid.' });
        }
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        let payload;
        try {
            console.log('Attempting token verification...');
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
            console.log('User ID missing in token');
            return res.status(401).json({ error: 'User ID (sub) not found in token.' });
        }

        // get recipe data from request body
        const { name, ingredients, instructions, source } = fields || {};
        console.log('Recipe data extracted:, { name, ingredients, instructions, source }:', { name, ingredients, instructions, source });
        // input validation
        if (!name || !ingredients) {
            console.log('Validation failed: Name or ingredients missing');
            return res.status(400).json({ error: 'Recipe name and ingredients are required.' });
        }

        // Upload image asset to Sanity
        // FIX ME: No server-side validation for image type or size
        // FIX ME: No specific error handling for image upload
        let pictureAssetRef = null;
        if (pictureFileObject && tempFilePath) {
            console.log('API AddRecipe: Uploading picture:', pictureFile.originalFilename);
            console.log('Valid picture file info found: Path:', tempFilePath);
            try {
                // Use fs.createReadStream if formidable saves the file to disk
                console.log('Uploading to Sanity Assets:', pictureFile.originalFilename);
                const uploadedAsset = await sanityClient.assets.upload('image', fs.createReadStream(pictureFile.filepath), {
                    filename: originalFilename, // Use original filename
                    contentType: mimetype
                });
                console.log('Sanity asset uploaded:', uploadedAsset._id);

                console.log('API AddRecipe: Image asset uploaded:', uploadedAsset._id);
                pictureAssetRef = {
                    _type: 'reference',
                    _ref: uploadedAsset._id,
                };

                // Clean up temporary file
                console.log('Attempting to delete temp file:', pictureFile.filepath);
                fs.unlink(pictureFile.filepath, (err) => {
                    if (err) console.error("Error deleting temp file:", err);
                });

            } catch (uploadError) {
                console.error('API AddRecipe: Sanity asset upload error:', uploadError);
                // FIX ME: I don't know if I want to fail the whole request or just proceed without the image
                // return res.status(500).json({ error: 'Failed to upload image.' });
                // For now, let's just log it and proceed without image
                pictureAssetRef = null;
            }
        } else {
            console.log('API AddRecipe: No picture file provided.');
        }


        // Prepare recipe data for Sanity
        const newRecipeDoc = {
            _type: 'recipes',
            userId: userId,
            name: name,
            ingredients: parseIngredients(ingredients),
            instructions: instructions || '',
            source: source || '',
            ...(pictureAssetRef && {
                picture: {
                    _type: 'image',
                    asset: pictureAssetRef, //  reference to the uploaded image assetq
                },
            })
        };

        // sanity operation
        console.log('API AddRecipe: Creating new recipe document:', newRecipeDoc);
        const createdRecipe = await sanityClient.create(newRecipeDoc);
        console.log('API AddRecipe: Created recipe document:', createdRecipe._id);
        
        // prepare savedRecipe document
        const savedRecipeDoc = {
            _type: 'savedRecipe',
            userId: userId,
            recipe: {
                _type: 'reference',
                _ref: createdRecipe._id,
            },
            savedAt: new Date().toISOString(),
        };

        console.log('API AddRecipe: Creaeting savedRecipe entry for recipe ID:', createdRecipe._id);
        const createdSavedEntry = await sanityClient.create(savedRecipeDoc);
        console.log('API AddRecipe: Created savedRecipe entry:', createdSavedEntry._id);

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