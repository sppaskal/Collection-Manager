import logger from '../utils/logger.js'
import {
  userExists,
  registerUser,
  generateJWT
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

    // Call service layer to register new user
    const newUser = await registerUser(username, password)

    res.status(201).json(newUser)
  } catch (err) {
    logger.error('Error creating user:', err)
    res.status(500).json({ error: 'Error creating user' })
  }
}

// -------------------------------------------------------------

export const login = async (req, res) => {
  const { username, password } = req.body

  // Check if input has required fields
  if (!username || !password) {
    return res.status(400).json(
      { message: 'Username and password are required' })
  }

  try {
    // Call service layer to check if username exists
    const user = await userExists(username)
    if (!user) {
      return res.status(401).json(
        { message: 'Invalid username' }
      )
    }

    // Check if password is valid for given user
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json(
        { message: 'Invalid password' }
      )
    }

    // Call service layer to generate JWT token
    const token = generateJWT(user)

    res.status(200).json({ message: 'Login successful', token })
  } catch (err) {
    logger.error('Error authenticating user:', err)
    res.status(500).json({ error: 'Error authenticating user' })
  }
}

// -------------------------------------------------------------
