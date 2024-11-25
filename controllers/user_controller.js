import logger from '../utils/logger.js'
import {
  registerUser
} from '../services/user_services.js'

// -------------------------------------------------------------

export const createUser = async (req, res) => {
  try {
    const registration = await registerUser(req.body)

    res.status(registration.status).json({ message: registration.message })
  } catch (err) {
    logger.error('Error creating user:', err)
    res.status(500).json({ error: 'Error creating user' })
  }
}

// -------------------------------------------------------------
