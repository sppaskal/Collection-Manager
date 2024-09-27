import mongoose from 'mongoose'
import cardSet from './card_set.js'
import cardPrice from './card_price.js'

const yugiohCard = new mongoose.Schema({
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
  card_sets: [cardSet.schema],
  card_prices: [cardPrice.schema]
})

export default mongoose.model('yugioh_card', yugiohCard)
