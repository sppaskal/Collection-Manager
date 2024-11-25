import User from '../models/authentication/user.js'

// -------------------------------------------------------------

export const userExists = async (username) => {
  return await User.findOne({ username })
}

// -------------------------------------------------------------

export const registerUser = async (username, password) => {
  const newUser = new User({ username, password })
  return (await newUser.save()).toObject()
}

// -------------------------------------------------------------
