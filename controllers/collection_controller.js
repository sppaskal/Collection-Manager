import logger from '../utils/logger.js'
import {
  uploadCardCopies
} from '../services/collection_services.js'

// -------------------------------------------------------------

/** Add copies of a card to user collection */
export async function addCards (req, res) {
  try {
    // Call service layer to upload copies of card
    const cardUpload = await uploadCardCopies(req.body)
    res.status(201).json(cardUpload)
  } catch (err) {
    logger.error('Error uploading card copies:', err)
    res.status(500).json({ error: 'Failed to add card copies' })
  }
}

// -------------------------------------------------------------
