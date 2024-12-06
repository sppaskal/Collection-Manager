import express from 'express'
import yugiohController from '../controllers/yugioh_controller.js'
import {
  authenticate
} from '../middlewares/auth_middleware.js'

const router = express.Router()
router.use(authenticate)

router.get('/yugioh_cards', yugiohController.getCards)
router.get('/yugioh_cards/set/:setName', yugiohController.getCardsBySet)
router.get('/yugioh_cards/id/:id', yugiohController.getCard)
router.get('/yugioh_cards/name/:name', yugiohController.getCard)
router.get('/yugioh_cards/set-code/:setCode', yugiohController.getCard)
router.get('/yugioh_cards/ids', yugiohController.getCardsByIds)
router.get('/yugioh_cards/images/:ids', yugiohController.getCardImages)

export default router
