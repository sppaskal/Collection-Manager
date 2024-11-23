import mongoose from 'mongoose'
import CardCopy from './card_copy.js'

const UserCollection = new mongoose.Schema({
  card_id: Number, // References id in detailed tcg specific collection
  user_id: String, // The user that owns card(s)
  tcg: String,
  name: String,
  quantity: Number,
  copies: [CardCopy]
})

export default mongoose.model('user_collection', UserCollection)
