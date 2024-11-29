import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import User from '../models/user/user.js'

// -------------------------------------------------------------

export const getUserByUsername = async (username) => {
  return await User.findOne({ username })
}

// -------------------------------------------------------------

export const getUserById = async (id) => {
  return await User.findOne({ _id: id })
}

// -------------------------------------------------------------

export const registerUser = async (username, password) => {
  const newUser = new User({ username, password })
  return (await newUser.save()).toObject()
}

// -------------------------------------------------------------

export const updateUser = async (user, data) => {
  if (data.username) user.username = data.username
  if (data.password) user.password = data.password
  return await user.save()
}

// -------------------------------------------------------------

export const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    config.secretKey,
    { expiresIn: config.jwtExpiry }
  )
}

// -------------------------------------------------------------
