import mongoose from 'mongoose'
import config from '../config/config.js'
import logger from '../utils/logger.js'

/** Connect to db using mongoose */
export async function connectToDatabase () {
  mongoose.connect(config.dbFullUri).then(() => {
    logger.info('Connected to MongoDB')
  }).catch(err => {
    logger.error('Failed to connect to MongoDB:', err)
  })
}
