import dotenv from 'dotenv'

// Loads environment variables from .env file
// into process.env
dotenv.config()

const config = {
  development: {
    port: process.env.DEV_PORT,
    db_uri: process.env.DEV_DB_URI,
    db_name: process.env.DEV_DB_NAME,
    render_test_mode: true
  },
  production: {
    port: process.env.PROD_PORT,
    db_uri: process.env.PROD_DB_URI,
    db_name: process.env.PROD_DB_NAME,
    render_test_mode: false
  }
}

const env = process.env.NODE_ENV || 'development'

export default config[env]
