import mongoose from 'mongoose'

const cardCopy = new mongoose.Schema({
  set_code: String,
  condition: String,
  rarity: String,
  cost: Number,
  currency: String
})

export default cardCopy
