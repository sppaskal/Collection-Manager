import mongoose from 'mongoose'
import CardSet from './card_set.js'
import CardPrice from './card_price.js'

/**
Maintaining custom id as source database uses it to
tie cards with their images.
 */

const YugiohCard = new mongoose.Schema({
  id: Number,
  name: String,
  typeline: [String],
  type: String,
  humanReadableCardType: String,
  frameType: String,
  desc: String,
  race: String,
  atk: Number,
  def: Number,
  level: Number,
  attribute: String,
  archetype: String,
  ygoprodeck_url: String,
  card_sets: [CardSet],
  card_prices: [CardPrice]
})

export default mongoose.model('yugioh_card', YugiohCard)
