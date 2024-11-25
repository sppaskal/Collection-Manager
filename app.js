import express from 'express'
import config from './config/config.js'
import morgan from 'morgan'
import logger from './utils/logger.js'
import { connectToDatabase } from './utils/db_helper.js'
import userRoutes from './routes/user_routes.js'
import yugiohRoutes from './routes/yugioh_routes.js'
import userCollectionRoutes from './routes/collection_routes.js'

const app = express()
const port = config.port

// Use Morgan to log HTTP requests
app.use(morgan('combined', {
  stream: {
    // Pipe logs into Winston
    write: (message) => logger.info(message.trim())
  }
}))
app.use(express.json()) // parse request body as JSON
app.use('/', userRoutes)
app.use('/', yugiohRoutes)
app.use('/', userCollectionRoutes)

await connectToDatabase()

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

export default app
