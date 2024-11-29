import config from '../config/config.js'
import logger from '../utils/logger.js'
import {
  fetchCards,
  fetchCardsBySet,
  fetchCard,
  fetchCardImagesByIds
} from '../services/yugioh_services.js'
import { renderYugiohCardToHtml } from '../utils/html_renderer.js'

// -------------------------------------------------------------

/** Get all cards */
export async function getCards (req, res) {
  try {
    const cards = await fetchCards()
    res.json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  }
}

// -------------------------------------------------------------

/** Get all cards for a specific set */
export async function getCardsBySet (req, res) {
  try {
    const { setName } = req.params
    const cards = await fetchCardsBySet(setName)

    if (cards.length === 0) {
      return res.status(404).json(
        { error: 'No cards found for the specified set' }
      )
    }

    res.json(cards)
  } catch (err) {
    logger.error('Error fetching cards:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  }
}

// -------------------------------------------------------------

/** Get a card by either 'name', 'id', or 'set-code'
 * and include image data if available */
export async function getCard (req, res) {
  try {
    const { name, id, setCode } = req.params
    const card = await fetchCard(name, id, setCode)

    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    const imgObj = await fetchCardImagesByIds(card.id)
    const imageBase64 = imgObj[card.id]

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
  }
}

// -------------------------------------------------------------

/** Get card image by id */
export async function getCardImages (req, res) {
  try {
    // Normalize req.params.id to always be an array
    // Limit processing ids to first 10
    const ids = req.params.ids.includes(',')
      ? req.params.ids.split(',').slice(0, 10)
      : [req.params.ids]

    const imageBase64 = await fetchCardImagesByIds(ids)

    if (!imageBase64) {
      return res.status(404).json({ error: 'Card images not found' })
    }

    return res.json(imageBase64)
  } catch (err) {
    logger.error('Error fetching card image:', err)
    return res.status(500).json({ error: 'Failed to fetch card image' })
  }
}
