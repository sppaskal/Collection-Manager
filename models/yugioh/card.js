import mongoose from 'mongoose'
import CardSet from './card_set.js'
import CardPrice from './card_price.js'

const yugiohCardSchema = new mongoose.Schema({
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
  card_sets: [CardSet.schema],
  card_prices: [CardPrice.schema]
})

export default mongoose.model('yugioh_card', yugiohCardSchema)
