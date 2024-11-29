import UserCollection from '../models/collection/user_collection.js'

/* eslint-disable camelcase */
// -------------------------------------------------------------

/** Add card(s) to user collection */
export async function uploadCardCopies (data) {
  const { card_id, user_id, tcg, name, quantity, copies } = data
  let entry = await UserCollection.findOne({ user_id, card_id })

  if (entry) {
    // Add new copy sub documents to the existing document entry
    entry.copies.push(...copies)
    entry.quantity += quantity
  } else {
    // Create a new document using the model if no entry exists
    entry = new UserCollection({
      card_id,
      user_id,
      tcg,
      name,
      quantity,
      copies
    })
  }

  // Save and return as JSON
  return (await entry.save()).toObject()
}

// -------------------------------------------------------------
