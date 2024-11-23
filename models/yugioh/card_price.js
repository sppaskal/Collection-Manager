import mongoose from 'mongoose'

const CardPrice = new mongoose.Schema({
  cardmarket_price: String,
  tcgplayer_price: String,
  ebay_price: String,
  amazon_price: String,
  coolstuffinc_price: String
})

export default CardPrice
