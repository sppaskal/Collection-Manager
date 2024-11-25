import jwt from 'jsonwebtoken'
import config from '../config/config.js'
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

export const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    config.secretKey,
    { expiresIn: config.jwtExpiry }
  )
}

// -------------------------------------------------------------
