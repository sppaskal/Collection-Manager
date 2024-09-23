import { MongoClient } from 'mongodb'
import config from '../config/config.js'
import logger from '../utils/logger.js'
import {
  fetchCards,
  fetchCardsBySet,
  fetchCard,
  fetchCardImageById
} from '../services/yugioh_services.js'
import { renderYugiohCardToHtml } from '../utils/html_renderer.js'

const uri = config.dbUri
const databaseName = config.dbName

// -------------------------------------------------------------

/** Get all cards */
export async function getCards (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)

    // Call service layer to fetch all cards
    const cards = await fetchCards(db)

    res.json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
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

    const { setName } = req.params

    // Call service layer to fetch cards
    const cards = await fetchCardsBySet(db, setName)

    if (cards.length === 0) {
      return res.status(404).json(
        { error: 'No cards found for the specified set' }
      )
    }

    res.json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  } finally {
    await client.close()
  }
}

// -------------------------------------------------------------

/** Get a card by either 'name', 'id', or 'set-code'
 * and include image data if available */
export async function getCard (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)

    const { name, id, setCode } = req.params

    // Call service layer to fetch card data
    const card = await fetchCard(db, name, id, setCode)

    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    // Call service layer to fetch card image
    const imageBase64 = await fetchCardImageById(db, card.id)

    if (imageBase64) {
      card.image = imageBase64
    }

    if (config.renderTestMode) {
      res.send(renderYugiohCardToHtml(card))
    } else {
      res.json(card)
    }
  } catch (err) {
    logger.error('Error fetching card:', err)
    res.status(500).json({ error: 'Failed to fetch card' })
  } finally {
    await client.close()
  }
}

// -------------------------------------------------------------

/** Get card image by id */
export async function getCardImage (req, res) {
  const client = new MongoClient(uri)

  try {
    const db = client.db(databaseName)

    const { id } = req.params

    // Call service layer to fetch card image
    const imageBase64 = await fetchCardImageById(db, id)

    if (!imageBase64) {
      return res.status(404).json({ error: 'Card image not found' })
    }

    return res.json(imageBase64)
  } catch (err) {
    logger.error('Error fetching card image:', err)
    return res.status(500).json({ error: 'Failed to fetch card image' })
  }
}
