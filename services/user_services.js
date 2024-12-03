import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import User from '../models/user/user.js'

// -------------------------------------------------------------

export async function getUserByUsername (username) {
  return await User.findOne({ username })
}

// -------------------------------------------------------------

export async function getUserById (id) {
  return await User.findOne({ _id: id })
}

// -------------------------------------------------------------

export async function registerUser (username, password) {
  const newUser = new User({ username, password })
  return (await newUser.save()).toObject()
}

// -------------------------------------------------------------

export async function updateUser (user, data) {
  if (data.username) user.username = data.username
  if (data.password) user.password = data.password
  return await user.save()
}

// -------------------------------------------------------------

export function generateJWT (user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    config.secretKey,
    { expiresIn: config.jwtExpiry }
  )
}

// -------------------------------------------------------------
