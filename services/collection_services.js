import UserCollection from '../models/collection/user_collection.js'
import { snakeToCamel } from '../utils/formatting_helper.js'

// -------------------------------------------------------------

/** Add card(s) to user collection */
async function uploadCardCopies (userId, requestData) {
  const data = snakeToCamel(requestData) // Normalize to camelCase

  const { cardId, tcg, name, quantity, copies, customInfo } = data
  let entry = await UserCollection.findOne(
    { user_id: userId, card_id: cardId }
  )

  if (entry) {
    entry.copies.push(...copies)
    entry.quantity += quantity
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

async function fetchCollection (userId, tcgName) {
  return await UserCollection.find({
    user_id: userId,
    tcg: tcgName
  })
}

// -------------------------------------------------------------

export default {
  uploadCardCopies,
  fetchCollection
}
