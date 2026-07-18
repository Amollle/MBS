import { Client, Account, Databases, Storage } from 'appwrite'

export const APPWRITE_ENDPOINT = 'https://sfo.cloud.appwrite.io/v1'
export const APPWRITE_PROJECT_ID = '6a5c00940033d704d729'
export const DATABASE_ID = 'mystuffsbetter'
export const BINDERS_COLLECTION_ID = 'binders'
export const CARDS_COLLECTION_ID = 'cards'
export const CARD_IMAGES_BUCKET_ID = 'card-images'

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export default client
