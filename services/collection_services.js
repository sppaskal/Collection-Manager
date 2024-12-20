import UserCollection from '../models/collection/user_collection.js'
import { snakeToCamel } from '../utils/formatting_helper.js'
import { caseInsensFullMatch } from '../utils/query_helper.js'

// -------------------------------------------------------------

/** Upload card(s) to user collection
 * NOTE: If an entry for given card already exists -->
 * Copies in requestData will be added to that entry.
*/
async function uploadCardCopies (userId, requestData) {
  const data = snakeToCamel(requestData) // Normalize to camelCase

  const { cardId, tcg, name, quantity, copies, customInfo } = data
  let entry = await UserCollection.findOne(
    { user_id: userId, card_id: cardId }
  )

  if (entry) {
    entry.copies.push(...copies)
  } else {
    entry = new UserCollection({
      card_id: cardId,
      user_id: userId,
      tcg,
      name,
      quantity,
      copies,
      custom_info: customInfo
    })
  }

  return (await entry.save()).toObject()
}

// -------------------------------------------------------------

// Replaces fields in entry with matching fields in data
async function updateEntry (entry, data) {
  for (const [key, value] of Object.entries(data)) {
    if (key in entry) {
      entry[key] = value
    }
  }

  await entry.validate()

  return (await entry.save()).toObject()
}

// -------------------------------------------------------------

async function fetchCollection (userId, tcgName) {
  return await UserCollection.find({
    user_id: userId,
    tcg: tcgName
  })
}

// -------------------------------------------------------------

async function fetchEntryById (userId, entryId) {
  return await UserCollection.findOne({
    user_id: userId,
    _id: entryId
  })
}

// -------------------------------------------------------------

async function fetchEntry (name, id, setCode) {
  let query = {}

  if (name) {
    query = caseInsensFullMatch('name', name)
  } else if (id) {
    query = { card_id: String(id) }
  } else if (setCode) {
    query = caseInsensFullMatch('copies.set_code', setCode)
  }

  return await UserCollection.findOne(query).lean()
}

// -------------------------------------------------------------

export default {
  uploadCardCopies,
  updateEntry,
  fetchCollection,
  fetchEntryById,
  fetchEntry
}
