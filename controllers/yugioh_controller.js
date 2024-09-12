import { MongoClient } from 'mongodb'

const uri = 'mongodb://localhost:27017'
const databaseName = 'collection_manager_db'
const cardDataCollection = 'yugioh_cards'

// Get all documents from the yugioh_cards collection
export async function getYugiohCards (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const collection = db.collection(cardDataCollection)

    const cards = await collection.find({}).toArray()

    res.json(cards)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  } finally {
    await client.close()
  }
}
