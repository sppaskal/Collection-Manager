import express from 'express'
import morgan from 'morgan'
import logger from './utils/logger.js'
import config from './config/config.js'
import yugiohRoutes from './routes/yugioh_routes.js'

const app = express()
const port = config.port

// Use Morgan to log HTTP requests
app.use(morgan('combined', {
  stream: {
    // Pipe logs into Winston
    write: (message) => logger.info(message.trim())
  }
}))

app.use('/', yugiohRoutes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
