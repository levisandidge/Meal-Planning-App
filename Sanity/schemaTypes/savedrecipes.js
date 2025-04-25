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
            name: 'recipe', 
            title: 'Recipe Reference',
            type: 'reference',
            to: [{ type: 'recipes' }], // Specify it references 'recipes' documents
            validation: (Rule) => Rule.required(), // Add validation if needed
        },
        {
            name: 'savedAt',
            title: 'Saved At',
            type: 'datetime',
            readOnly: true,
            hidden: true,
        }
    ]
}