import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {formSchema} from '@sanity/form-toolkit/form-schema'

export default defineConfig({
  name: 'default',
  title: 'MealPlanner',

  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,

  plugins: [structureTool(), visionTool(), formSchema()],

  schema: {
    types: schemaTypes,
  },
})
