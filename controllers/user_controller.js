import logger from '../utils/logger.js'
import userService from '../services/user_services.js'

// -------------------------------------------------------------

async function createUser (req, res) {
  try {
    const { username, password } = req.body

    // Check if input has required fields
    if (!username || !password) {
      return res.status(400).json(
        { error: 'Username and password are required' }
      )
    }

    // Check if user with provided username already exists
    if (await userService.getUserByUsername(username)) {
      return res.status(400).json(
        { error: 'Username already exists' }
      )
    }

    const newUser = await userService.registerUser(username, password)

    return res.status(201).json(newUser)
  } catch (err) {
    logger.error('Error creating user:', err)
    return res.status(500).json({ error: 'Error creating user' })
  }
}

// -------------------------------------------------------------

async function editUser (req, res) {
  try {
    // Assuming `req.user` contains the authenticated user's information
    const userId = req.user.id
    const { username, password } = req.body

    // Check that there is data to update
    if (!username && !password) {
      return res.status(400).json({ error: 'No data provided to update' })
    }

    // Check if current user exists
    const user = await userService.getUserById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const updatedUser = await userService.updateUser(user, req.body)

    return res.status(200).json({
      message: 'User updated successfully',
      user: { username: updatedUser.username }
    })
  } catch (err) {
    logger.error('Error updating user:', err)
    return res.status(500).json({ error: 'Error updating user' })
  }
}

// -------------------------------------------------------------

async function login (req, res) {
  const { username, password } = req.body

  // Check if input has required fields
  if (!username || !password) {
    return res.status(400).json(
      { message: 'Username and password are required' })
  }

  try {
    // Check if username exists
    const user = await userService.getUserByUsername(username)
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

    const token = userService.generateJWT(user)

    return res.status(200).json({ message: 'Login successful', token })
  } catch (err) {
    logger.error('Error authenticating user:', err)
    return res.status(500).json({ error: 'Error authenticating user' })
  }
}

// -------------------------------------------------------------

export default {
  createUser,
  editUser,
  login
}
