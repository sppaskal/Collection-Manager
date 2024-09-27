import mongoose from 'mongoose'
import config from '../config/config.js'

/** Connect to db using mongoose */
export async function connectToDatabase () {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.dbFullUri)
  }
}
