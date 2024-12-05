import mongoose from 'mongoose'
import CardCopy from './card_copy.js'

const tcgChoices = [
  'Yu-Gi-Oh!',
  'World of Warcraft',
  'Magic: The Gathering',
  'Pokémon',
  'NBA',
  'Hockey',
  'Other'
]

/**
 * Uploaded datasets for supported TCGs will often have their
 * own unique ids which are maintained to preserve connections
 * to images and other data. This is why 'card_id' is of type
 * String instead of referencing the internal mongoose ObjectId.
 */

const UserCollection = new mongoose.Schema({
  card_id: {
    type: String,
    required: true
  }, // References custom id in detailed TCG-specific documents
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Sets up a reference to the User model
    required: true
  },
  tcg: {
    type: String,
    required: true,
    enum: tcgChoices
  },
  name: { type: String, required: true },
  quantity: {
    type: Number,
    default: 1
  },
  copies: [CardCopy],
  custom_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    validate: {
      validator: function (value) {
        try {
          JSON.stringify(value)
          return true
        } catch (err) {
          return false
        }
      },
      message: 'custom_info must be a valid JSON object'
    }
  } // JSON field for storing custom data points
})

// -------------------------------------------------------------

UserCollection.pre('save', function (next) {
  // Ensure quantity matches the length of copies
  this.quantity = this.copies.length
  next()
})

// -------------------------------------------------------------

export default mongoose.model('user_collection', UserCollection)
