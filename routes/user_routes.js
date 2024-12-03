import express from 'express'
import userController from '../controllers/user_controller.js'
import {
  authenticate
} from '../middlewares/auth_middleware.js'

const router = express.Router()

router.post('/user/create', userController.createUser)
router.patch('/user/edit', authenticate, userController.editUser)
router.get('/user/login', userController.login)

export default router
