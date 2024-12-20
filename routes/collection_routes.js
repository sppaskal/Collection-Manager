import express from 'express'
import collectionController from '../controllers/collection_controller.js'
import {
  authenticate
} from '../middlewares/auth_middleware.js'

const router = express.Router()
router.use(authenticate)

router.post('/user_collection/add', collectionController.addCards)
router.patch('/user_collection/:entryId', collectionController.editCollectionEntry)
router.get('/user_collection/:tcg', collectionController.getCollection)
router.get('/user_collection/name/:name', collectionController.getCollectionEntry)
router.get('/user_collection/id/:id', collectionController.getCollectionEntry)
router.get('/user_collection/set_code/:setCode', collectionController.getCollectionEntry)

export default router
