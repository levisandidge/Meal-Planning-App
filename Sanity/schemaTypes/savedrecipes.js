export default {
    name: 'savedRecipe',
    title: 'Saved Recipe',
    type: 'document',
    fields: [
        {
            name: 'userId',
            title: 'User ID (Auth0 SUB)',
            type: 'string',
            readOnly: true,
            hidden: true,
            validation: (Rule) => Rule.required(),
            options: {
                isHighlighted: true
            }
        },
        {
            name: 'recipeId',
            title: 'Recipe ID',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string',
            title: 'Recipe Name'
        },
        {
            name: 'picture',
            type: 'image',
            title: 'Picture'
        },
        {
            name: 'ingredients',
            type: 'array',
            title: 'Ingredients',
            of: [{ type: 'ingredient' }], // Use the ingredient type in an array
        },
        {
            name: 'instructions',
            type: 'string',
            title: 'Instructions'
        },
        {
            name: 'source',
            type: 'string',
            title: 'Source'
        }
    ]
}