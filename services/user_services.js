import User from '../models/authentication/user.js'

// -------------------------------------------------------------

export const registerUser = async (userData) => {
  const { username, password } = userData

  if (!username || !password) {
    return { status: 400, message: 'Username and password are required' }
  }

  const userExists = await User.findOne({ username })
  if (userExists) {
    return { status: 400, message: 'Username already exists' }
  }

  const newUser = new User({ username, password })
  await newUser.save()

  return { status: 201, message: `Successfully created user: ${username}` }
}

// -------------------------------------------------------------
