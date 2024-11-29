import express from 'express'
import {
  createUser,
  editUser,
  login
} from '../controllers/user_controller.js'
import {
  authenticate
} from '../middlewares/auth_middleware.js'

const router = express.Router()

router.post('/user/create', createUser)
router.patch('/user/edit', authenticate, editUser)
router.get('/user/login', login)

export default router
