import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: '441lyunu',
  dataset: 'production',
  apiVersion: '2026-03-15',
  useCdn: true,
})