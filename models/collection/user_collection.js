import mongoose from 'mongoose'
import cardCopy from './card_copy.js'

const userCollection = new mongoose.Schema({
  id: Number, // Id of ownership entry
  card_id: Number, // References id in detailed tcg specific collection
  user_id: Number, // The user that owns card(s)
  tcg: String,
  name: String,
  quantity: Number,
  copies: [cardCopy]
})

export default mongoose.model('user_collection', userCollection)
