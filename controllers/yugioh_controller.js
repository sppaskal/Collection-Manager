import config from '../config/config.js'
import { MongoClient } from 'mongodb'
import { renderYugiohCardToHtml } from '../helpers/html_renderer.js'
import {
  caseInsensFullMatch,
  caseInsensPartMatch
} from '../helpers/query_helper.js'

const uri = config.dbUri
const databaseName = config.dbName
const cardData = 'yugioh_cards'
const cardImageMetadata = 'yugioh_card_images.files'
const cardImageChunks = 'yugioh_card_images.chunks'

// -------------------------------------------------------------

/** Get all cards */
export async function getCards (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const collection = db.collection(cardData)

    // Fetch all cards
    const cards = await collection.find({}).toArray()

    res.json(cards)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  } finally {
    await client.close()
  }
}

// -------------------------------------------------------------

/** Get all cards for a specific set */
export async function getCardsBySet (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const collection = db.collection(cardData)

    const { setName } = req.params

    // Query to find documents where set_name is an exact match
    // or set_code contains the provided string (case insensitive)
    const query = {
      $or: [
        caseInsensFullMatch('card_sets.set_name', setName),
        caseInsensPartMatch('card_sets.set_code', setName)
      ]
    }

    // Fetch all matching cards
    const cards = await collection.find(query).toArray()

    // If no cards are found, return a 404 status
    if (cards.length === 0) {
      return res.status(404).json(
        { error: 'No cards found for the specified set' }
      )
    }

    res.json(cards)
  } catch (err) {
    console.error('Error fetching cards:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  } finally {
    await client.close()
  }
}

// -------------------------------------------------------------

/** Get a card by either 'name', 'id', or 'set-code'
 * and include image data */
export async function getCard (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const cardCollection = db.collection(cardData)
    const imageFilesCollection = db.collection(cardImageMetadata)
    const imageChunksCollection = db.collection(cardImageChunks)

    const { name, id, setCode } = req.params

    let query = {}

    // Query card by either name (case insensitive) or id or set
    if (name) {
      query = caseInsensFullMatch('name', name)
    } else if (id) {
      query = { id: Number(id) }
    } else if (setCode) {
      query = caseInsensFullMatch('card_sets.set_code', setCode)
    }

    const card = await cardCollection.findOne(query)

    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    // Retrieve the associated image file from GridFS
    const imageFile = await imageFilesCollection.findOne({ _id: String(card.id) })

    // If an image for the given card is found
    if (imageFile) {
      // Retrieve the image data from GridFS chunks
      const downloadStream = imageChunksCollection.find({ files_id: imageFile._id }).sort({ n: 1 })

      // Buffer to store the image data
      const imageData = []
      for await (const chunk of downloadStream) {
        imageData.push(chunk.data.buffer)
      }

      // Combine the chunks into a single buffer
      const imageBuffer = Buffer.concat(imageData)

      // Attach the image as base64-encoded data
      const imageBase64 = `data:${imageFile.contentType};base64,${imageBuffer.toString('base64')}`
      card.image = imageBase64
    }

    if (config.renderTestMode) {
      res.send(renderYugiohCardToHtml(card))
    } else {
      res.json(card)
    }
  } catch (err) {
    console.error('Error fetching card:', err)
    res.status(500).json({ error: 'Failed to fetch card' })
  } finally {
    await client.close()
  }
}
