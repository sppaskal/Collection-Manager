import express from 'express'
import config from './config/config.js'
import yugiohRoutes from './routes/yugioh_routes.js'

const app = express()
const port = config.port

app.use('/', yugiohRoutes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
