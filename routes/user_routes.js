import express from 'express'
import {
  createUser,
  login
} from '../controllers/user_controller.js'

const router = express.Router()

router.post('/user/create', createUser)
router.get('/user/login', login)

export default router
