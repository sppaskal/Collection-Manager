import express from 'express'
import {
  getCards,
  getCard,
  getCardsBySet,
  getCardImages
} from '../controllers/yugioh_controller.js'

const router = express.Router()

router.get('/yugioh_cards', getCards)
router.get('/yugioh_cards/set/:setName', getCardsBySet)
router.get('/yugioh_cards/id/:id', getCard)
router.get('/yugioh_cards/name/:name', getCard)
router.get('/yugioh_cards/set-code/:setCode', getCard)
router.get('/yugioh_cards/images/:ids', getCardImages)

export default router
