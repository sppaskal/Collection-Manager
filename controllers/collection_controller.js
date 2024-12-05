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

/** Edit user's card
 * Input fields should contain full data because:
 * Any field included in the request body will be
 * replaced, including fields with nested objects.
*/
async function editCollectionEntry (req, res) {
  try {
    const userId = req.user.id
    const { entryId } = req.params

    const entry = await collectionService.fetchEntryById(
      userId,
      entryId
    )

    if (!entry) {
      return res.status(400).json({
        message: 'No entry found for given id and user'
      })
    }

    const updatedEntry = await collectionService.updateEntry(
      entry,
      req.body
    )

    return res.status(200).json({
      message: 'Collection entry updated successfully',
      entry: updatedEntry
    })
  } catch (err) {
    logger.error('Error updating user collection entry:', err)
    return res.status(500).json({ error: 'Failed to update user collection entry' })
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

    return res.status(200).json(cards)
  } catch (err) {
    logger.error('Error getting user cards for specified tcg:', err)
    return res.status(500).json({ error: 'Failed to get user cards' })
  }
}

// -------------------------------------------------------------

async function getCollectionEntry (req, res) {
  try {
    const { name, id, setCode } = req.params
    const entry = await collectionService.fetchEntry(
      name,
      id,
      setCode
    )

    if (!entry) {
      return res.status(404).json({ error: 'Card entry not found' })
    }

    return res.status(200).json(entry)
  } catch (err) {
    logger.error('Error getting cards for specific entry:', err)
    return res.status(500).json({ error: 'Failed to get entry' })
  }
}

// -------------------------------------------------------------

export default {
  addCards,
  editCollectionEntry,
  getCollection,
  getCollectionEntry
}
