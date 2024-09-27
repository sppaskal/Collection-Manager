import mongoose from 'mongoose'
import yugiohCard from '../models/yugioh/card.js'
import {
  caseInsensFullMatch,
  caseInsensPartMatch
} from '../utils/query_helper.js'

const cardImageMetadata = 'yugioh_card_images.files'
const cardImageChunks = 'yugioh_card_images.chunks'

// -------------------------------------------------------------

/** Fetch all cards */
export async function fetchCards () {
  return await yugiohCard.find()
}

// -------------------------------------------------------------

/** Fetch cards by set */
export async function fetchCardsBySet (setName) {
  // Query to find documents where set_name is an exact match
  // or set_code contains the provided string (case insensitive)
  const query = {
    $or: [
      caseInsensFullMatch('card_sets.set_name', setName),
      caseInsensPartMatch('card_sets.set_code', setName)
    ]
  }

  // Fetch all matching cards
  // return await collection.find(query).toArray()
  return await yugiohCard.find(query)
}

// -------------------------------------------------------------

/** Fetch card by name, id, or set code */
export async function fetchCard (name, id, setCode) {
  let query = {}

  if (name) {
    query = caseInsensFullMatch('name', name)
  } else if (id) {
    query = { id: Number(id) }
  } else if (setCode) {
    query = caseInsensFullMatch('card_sets.set_code', setCode)
  }

  return await yugiohCard.findOne(query).lean()
}

// -------------------------------------------------------------

/** Fetch card image by id from GridFS */
export async function fetchCardImageById (id) {
  const db = mongoose.connection.db
  const imageFilesCollection = db.collection(cardImageMetadata)
  const imageChunksCollection = db.collection(cardImageChunks)

  const imageFile = await imageFilesCollection.findOne(
    { _id: String(id) }
  )

  if (!imageFile) {
    return null
  }

  // Retrieve the image data from GridFS chunks
  const downloadStream = imageChunksCollection.find(
    { files_id: imageFile._id }).sort({ n: 1 }
  )

  // Buffer to store the image data
  const imageData = []
  for await (const chunk of downloadStream) {
    imageData.push(chunk.data.buffer)
  }

  // Combine the chunks into a single buffer
  const imageBuffer = Buffer.concat(imageData)

  return `data:${imageFile.contentType};base64,` +
  `${imageBuffer.toString('base64')}`
}
