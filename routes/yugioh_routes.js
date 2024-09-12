import express from 'express'
import { getYugiohCards } from '../controllers/yugioh_controller.js'

const router = express.Router()

router.get('/yugioh_cards', getYugiohCards)

export default router
