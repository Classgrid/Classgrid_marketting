import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  perspective: 'published',
  // Enable CDN so repeated page navigations are not blocked by live API latency.
  useCdn: true,
})
