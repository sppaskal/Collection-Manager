import UserCollection from '../models/collection/user_collection.js'

/* eslint-disable camelcase */
// -------------------------------------------------------------

/** Add card(s) to user collection */
export async function uploadCardCopies (data) {
  const { card_id, user_id, tcg, name, quantity, copies } = data

  // Check if an entry already exists for the same user_id and card_id
  let entry = await UserCollection.findOne({ user_id, card_id })

  if (entry) {
    // Add new copies to the existing entry
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

  // Save the document to the database
  const savedEntry = await entry.save()

  // Return the saved document as JSON
  return savedEntry.toObject()
}

// -------------------------------------------------------------
