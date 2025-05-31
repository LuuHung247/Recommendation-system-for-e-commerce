# Transitioning to MongoDB

This guide will help you transition from mock data to MongoDB when you're ready to deploy to production.

## Step 1: Install MongoDB Dependencies

\`\`\`bash
npm install mongodb
\`\`\`

## Step 2: Create MongoDB Connection Utility

Create a file at `lib/mongodb.ts`:

\`\`\`typescript
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local")
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db()
  return { client, db }
}
\`\`\`

## Step 3: Update Data Service

Modify `lib/data-service.ts` to use MongoDB:

\`\`\`typescript
import { connectToDatabase } from "./mongodb"
import { items, users, reviews, predictions, itemRecommendations } from "./mock-data"

// Set this to false to use MongoDB instead of mock data
const USE_MOCK_DATA = false

export async function getItems(page = 1, limit = 12, category?: string) {
  if (USE_MOCK_DATA) {
    const filteredItems = category ? items.filter((item) => item.main_category === category) : items
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return filteredItems.slice(startIndex, endIndex)
  } else {
    const { db } = await connectToDatabase()
    const query = category ? { main_category: category } : {}
    const skip = (page - 1) * limit
    return db.collection("item").find(query).sort({ rating_number: -1 }).skip(skip).limit(limit).toArray()
  }
}

// Update other functions similarly...
\`\`\`

## Step 4: Add MongoDB Connection String

Add your MongoDB connection string to your environment variables:

1. For local development: Create a `.env.local` file with:
   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   \`\`\`

2. For Vercel deployment: Add the environment variable in the Vercel dashboard.

## Step 5: Populate Your MongoDB Database

Ensure your MongoDB database has the following collections with the correct schema:

- `item`: Products with main_category, title, average_rating, rating_number, and item_index
- `user`: Users with user_index
- `review`: Reviews with user_index, rating, and item_index
- `predict`: User recommendations with user_index and recommendation array
- `item_recommend`: Item-to-item recommendations with item_index and recommendation array

You can use the mock data as a reference for the expected schema.
