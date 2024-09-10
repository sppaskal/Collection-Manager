import { MongoClient, GridFSBucket } from 'mongodb'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pipeline } from 'stream'
import { promisify } from 'util'

const { readdir } = fs.promises

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pipelinePromise = promisify(pipeline)

const uri = 'mongodb://localhost:27017' // Local MongoDB URI
const databaseName = 'collection_manager_db'
const collectionName = 'game_card_images' // change to specific game
const imagesDir = path.join(__dirname, '../temp/images')

const MAX_CONCURRENT_UPLOADS = 10

async function uploadImage (file, bucket, directoryPath) {
  const cardId = path.basename(file, path.extname(file))
  const filePath = path.join(directoryPath, file)

  const imageFileStream = fs.createReadStream(filePath) // Use createReadStream for file streams
  const uploadStream = bucket.openUploadStreamWithId(cardId, file)

  await pipelinePromise(imageFileStream, uploadStream)

  console.log(`Image uploaded successfully for card ID: ${cardId}`)
}

async function uploadImagesWithLimit (directoryPath, maxConcurrent) {
  const client = new MongoClient(uri)
  await client.connect()

  const db = client.db(databaseName)
  const bucket = new GridFSBucket(db, { bucketName: collectionName })

  try {
    const files = await readdir(directoryPath)

    let index = 0
    while (index < files.length) {
      const batch = files.slice(index, index + maxConcurrent)
      const promises = batch.map(file => uploadImage(file, bucket, directoryPath))

      await Promise.allSettled(promises)
      console.log(`Batch (index: ${index} --> ${index + maxConcurrent - 1}) uploaded`)
      index += maxConcurrent
    }

    console.log('All images uploaded successfully')
  } catch (err) {
    console.error('Error processing images:', err)
  } finally {
    await client.close()
  }
}

uploadImagesWithLimit(imagesDir, MAX_CONCURRENT_UPLOADS)
