import dotenv from 'dotenv'

// Loads environment variables from .env file
// into process.env
dotenv.config()

const config = {
  development: {
    port: process.env.DEV_PORT,
    dbUri: process.env.DEV_DB_URI,
    dbName: process.env.DEV_DB_NAME,
    renderTestMode: false,
    loggingLevel: 'debug',
    secretKey: process.env.DEV_SECRET_KEY,
    jwtExpiry: '24h'
  },
  production: {
    port: process.env.PROD_PORT,
    dbUri: process.env.PROD_DB_URI,
    dbName: process.env.PROD_DB_NAME,
    renderTestMode: false,
    loggingLevel: 'info',
    secretKey: process.env.PROD_SECRET_KEY,
    jwtExpiry: '2h'
  }
}

config.development.dbFullUri = `${config.development.dbUri}/` +
                                `${config.development.dbName}`
config.production.dbFullUri = `${config.production.dbUri}/` +
                               `${config.production.dbName}`

const env = process.env.NODE_ENV || 'development'

export default config[env]
