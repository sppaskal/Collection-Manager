import mongoose from 'mongoose'

const CardCopy = new mongoose.Schema({
  set_code: String,
  condition: String,
  rarity: String,
  cost: Number,
  currency: String
})

export default CardCopy
