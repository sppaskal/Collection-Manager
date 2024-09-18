import express from 'express'
import {
  getCards,
  getCard
} from '../controllers/yugioh_controller.js'

const router = express.Router()

router.get('/yugioh_cards', getCards)
router.get('/yugioh_cards/:id', getCard)
router.get('/yugioh_cards/name/:name', getCard)
router.get('/yugioh_cards/set-code/:setCode', getCard)

export default router
