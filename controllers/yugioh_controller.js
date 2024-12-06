import config from '../config/config.js'
import logger from '../utils/logger.js'
import yugiohService from '../services/yugioh_services.js'
import { renderYugiohCardToHtml } from '../utils/html_renderer.js'

// -------------------------------------------------------------

/** Get all cards */
async function getCards (req, res) {
  try {
    const cards = await yugiohService.fetchCards()
    return res.json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
    return res.status(500).json({ error: 'Failed to fetch cards' })
  }
}

// -------------------------------------------------------------

/** Get all cards for a specific set */
async function getCardsBySet (req, res) {
  try {
    const { setName } = req.params
    const cards = await yugiohService.fetchCardsBySet(setName)

    if (cards.length === 0) {
      return res.status(404).json(
        { error: 'No cards found for the specified set' }
      )
    }

    return res.json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
    return res.status(500).json({ error: 'Failed to fetch cards' })
  }
}

// -------------------------------------------------------------

/** Get a card by either 'name', 'id', or 'set-code'
 * and include image data if available */
async function getCard (req, res) {
  try {
    const { name, id, setCode } = req.params
    const card = await yugiohService.fetchCard(name, id, setCode)

    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    const imgObj = await yugiohService.fetchCardImagesByIds(card.id)
    const imageBase64 = imgObj[card.id]

    if (imageBase64) {
      card.image = imageBase64
    }

    if (config.renderTestMode) {
      return res.send(renderYugiohCardToHtml(card))
    } else {
      return res.json(card)
    }
  } catch (err) {
    logger.error('Error fetching card:', err)
    return res.status(500).json({ error: 'Failed to fetch card' })
  }
}

// -------------------------------------------------------------

/** Get cards by their ids */
async function getCardsByIds (req, res) {
  try {
    const { ids } = req.body
    const maxIds = 50 // Max ids to respond to
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json(
        { error: 'Invalid or missing "ids" field' }
      )
    }

    const cards = await yugiohService.fetchCardsByIds(
      ids.slice(0, maxIds)
    )
    return res.status(200).json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
    return res.status(500).json({ error: 'Failed to fetch cards' })
  }
}

// -------------------------------------------------------------

/** Get card image by id */
async function getCardImages (req, res) {
  try {
    // Normalize req.params.id to always be an array
    // Limit processing ids to first 10
    const ids = req.params.ids.includes(',')
      ? req.params.ids.split(',').slice(0, 10)
      : [req.params.ids]

    const imageBase64 = await yugiohService.fetchCardImagesByIds(ids)

    if (!imageBase64) {
      return res.status(404).json({ error: 'Card images not found' })
    }

    return res.json(imageBase64)
  } catch (err) {
    logger.error('Error fetching card image:', err)
    return res.status(500).json({ error: 'Failed to fetch card image' })
  }
}

// -------------------------------------------------------------

export default {
  getCards,
  getCardsBySet,
  getCard,
  getCardsByIds,
  getCardImages
}
