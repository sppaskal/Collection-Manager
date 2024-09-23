import dotenv from 'dotenv'

// Loads environment variables from .env file
// into process.env
dotenv.config()

const config = {
  development: {
    port: process.env.DEV_PORT,
    dbUri: process.env.DEV_DB_URI,
    dbName: process.env.DEV_DB_NAME,
    renderTestMode: true,
    loggingLevel: 'debug'
  },
  production: {
    port: process.env.PROD_PORT,
    dbUri: process.env.PROD_DB_URI,
    dbName: process.env.PROD_DB_NAME,
    renderTestMode: false,
    loggingLevel: 'info'
  }
}

const env = process.env.NODE_ENV || 'development'

export default config[env]
