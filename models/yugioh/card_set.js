import mongoose from 'mongoose'

const CardSet = new mongoose.Schema({
  set_name: String,
  set_code: String,
  set_rarity: String,
  set_rarity_code: String,
  set_price: String
})

export default CardSet
