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
        },
        {
            name: 'ingredient',
            type:'object',
            title: 'Ingredient 1',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingTwo',
            type:'object',
            title: 'Ingredient 2',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name:'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingThree',
            type:'object',
            title: 'Ingredient 3',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingFour',
            type:'object',
            title: 'Ingredient 4',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingFive',
            type:'object',
            title: 'Ingredient 5',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingSix',
            type:'object',
            title: 'Ingredient 6',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingSeven',
            type:'object',
            title: 'Ingredient 7',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingEight',
            type:'object',
            title: 'Ingredient 8',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingNine',
            type:'object',
            title: 'Ingredient 9',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
        },
        {
            name: 'ingTen',
            type:'object',
            title: 'Ingredient 10',
            fields: [
                {
                    name: 'ingredient',
                    type:'string',
                    title: 'Ingredient'
                },
                {
                    name: 'measurement',
                    type:'string',
                    title: 'Measurement'
                },
                {
                    name: 'price',
                    type:'number',
                    title: 'Price'
                }
            ]
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