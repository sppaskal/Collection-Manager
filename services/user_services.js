import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import User from '../models/user/user.js'

// -------------------------------------------------------------

async function getUserByUsername (username) {
  return await User.findOne({ username })
}

// -------------------------------------------------------------

async function getUserById (id) {
  return await User.findOne({ _id: id })
}

// -------------------------------------------------------------

async function registerUser (username, password) {
  const newUser = new User({ username, password })
  return (await newUser.save()).toObject()
}

// -------------------------------------------------------------

async function updateUser (user, data) {
  if (data.username) user.username = data.username
  if (data.password) user.password = data.password
  return await user.save()
}

// -------------------------------------------------------------

function generateJWT (user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    config.secretKey,
    { expiresIn: config.jwtExpiry }
  )
}

// -------------------------------------------------------------

export default {
  getUserByUsername,
  getUserById,
  registerUser,
  updateUser,
  generateJWT
}
