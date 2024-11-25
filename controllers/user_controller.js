import logger from '../utils/logger.js'
import {
  userExists,
  registerUser
} from '../services/user_services.js'

// -------------------------------------------------------------

export const createUser = async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if input has required fields
    if (!username || !password) {
      return res.status(400).json(
        { error: 'Username and password are required' }
      )
    }

    // Check if user with provided username already exists
    if (await userExists(username)) {
      return res.status(400).json(
        { error: 'Username already exists' }
      )
    }

    const newUser = await registerUser(username, password)

    res.status(201).json(newUser)
  } catch (err) {
    logger.error('Error creating user:', err)
    res.status(500).json({ error: 'Error creating user' })
  }
}

// -------------------------------------------------------------
