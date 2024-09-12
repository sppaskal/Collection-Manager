import { MongoClient } from 'mongodb'

const uri = 'mongodb://localhost:27017'
const databaseName = 'collection_manager_db'
const cardDataCollection = 'yugioh_cards'

// Get all cards from the yugioh_cards collection
export async function getCards (req, res) {
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

// Get a card by either 'name' or 'id'
export async function getCardByNameOrId (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const collection = db.collection(cardDataCollection)

    const { name, id } = req.params

    let query = {}

    // query card by either name or id
    // depending on which is provided
    if (name) {
      // Use case-insensitive regex to match the name
      query = { name: { $regex: new RegExp(`^${name}$`, 'i') } }
    } else if (id) {
      query = { id: Number(id) }
    }

    const card = await collection.findOne(query)

    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    res.json(card)
  } catch (err) {
    console.error('Error fetching card:', err)
    res.status(500).json({ error: 'Failed to fetch card' })
  } finally {
    await client.close()
  }
}
