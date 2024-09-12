import express from 'express'
import {
  getCards,
  getCardByNameOrId
} from '../controllers/yugioh_controller.js'

const router = express.Router()

router.get('/yugioh_cards', getCards)
router.get('/yugioh_cards/:id', getCardByNameOrId)
router.get('/yugioh_cards/name/:name', getCardByNameOrId)

export default router
