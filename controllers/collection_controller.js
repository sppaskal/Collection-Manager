import logger from '../utils/logger.js'
import collectionService from '../services/collection_services.js'

// -------------------------------------------------------------

/** Add copies of a card to user collection */
async function addCards (req, res) {
  try {
    const cardUpload = await collectionService.uploadCardCopies(
      req.user.id,
      req.body
    )
    res.status(201).json(cardUpload)
  } catch (err) {
    logger.error('Error uploading card copies:', err)
    res.status(500).json({ error: 'Failed to add card copies' })
  }
}

// -------------------------------------------------------------

/** Get user's cards for specific TCG */
async function getCollection (req, res) {
  try {
    const { tcg } = req.params
    const cards = await collectionService.fetchCollection(
      req.user.id,
      tcg
    )

    if (cards.length === 0) {
      return res.status(404).json(
        { error: 'User has no cards for the specified tcg' }
      )
    }

    res.status(200).json(cards)
  } catch (err) {
    logger.error('Error getting user cards for specified tcg:', err)
    res.status(500).json({ error: 'Failed to get user cards' })
  }
}

// -------------------------------------------------------------

export default {
  addCards,
  getCollection
}
