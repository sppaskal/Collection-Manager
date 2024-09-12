import express from 'express'
import yugiohRoutes from './routes/yugioh_routes.js'

const app = express()
const port = 3000

app.use('/', yugiohRoutes)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
