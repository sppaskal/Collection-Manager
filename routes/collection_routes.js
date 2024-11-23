import express from 'express'
import {
  addCards
} from '../controllers/collection_controller.js'

const router = express.Router()

router.post('/user_collection/add', addCards)

export default router
