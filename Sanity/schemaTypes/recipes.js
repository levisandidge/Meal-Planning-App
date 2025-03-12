export default {
    name: 'recipes',
    type: 'document',
    title: 'Recipes',
    fields: [
        {
            name: 'name',
            type: 'string',
            title: 'Recipe Name'
        },
        {
            name: 'picture',
            type: 'image',
            title: 'Picture'
        }
    ]
}