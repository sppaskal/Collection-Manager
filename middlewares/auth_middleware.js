import jwt from 'jsonwebtoken'
import config from '../config/config.js'

// -------------------------------------------------------------

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided' })
  }

  try {
    const decoded = jwt.verify(token, config.secretKey)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}
