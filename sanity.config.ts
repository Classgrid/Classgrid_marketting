'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure, defaultDocumentNode} from './sanity/deskStructure'
import {SendThankYouEmailAction} from './sanity/actions/sendThankYouEmailAction'
import {createPublishWithEmailAction} from './sanity/actions/PublishWithEmailAction'
import {createPublishWithNotificationToast} from './sanity/actions/PublishWithNotificationToast'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure, defaultDocumentNode}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  document: {
    // Add the Send Thank You Email button to the communityReview document actions, and wrap the publish action
    actions: (prev, { schemaType }) => {
      // 1. Community Review Action
      if (schemaType === 'communityReview') {
        const customizedActions = prev.map((originalAction) => {
          if (originalAction.action === 'publish') {
            return createPublishWithEmailAction(originalAction)
          }
          return originalAction
        })
        return [...customizedActions, SendThankYouEmailAction]
      }

      // 2. Email Notification Toast Action for Blogs, Changelogs, Legal Pages
      if (['post', 'changelogEntry', 'legalPage'].includes(schemaType)) {
        return prev.map((originalAction) => {
          if (originalAction.action === 'publish') {
            return createPublishWithNotificationToast(originalAction)
          }
          return originalAction
        })
      }

      return prev
    },
  },
})
