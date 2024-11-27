import express from 'express'
import {
  addCards
} from '../controllers/collection_controller.js'
import {
  authenticate
} from '../middlewares/auth_middleware.js'

const router = express.Router()
router.use(authenticate)

router.post('/user_collection/add', addCards)

export default router
