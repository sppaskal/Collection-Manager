import {
  caseInsensFullMatch,
  caseInsensPartMatch
} from '../helpers/query_helper.js'

const cardData = 'yugioh_cards'
const cardImageMetadata = 'yugioh_card_images.files'
const cardImageChunks = 'yugioh_card_images.chunks'

// -------------------------------------------------------------

/** Fetch all cards */
export async function fetchCards (db) {
  try {
    const collection = db.collection(cardData)
    return collection.find({}).toArray()
  } catch (err) {
    console.error('Error fetching cards:', err)
    throw new Error('Failed to fetch cards')
  }
}

// -------------------------------------------------------------

/** Fetch cards by set */
export async function fetchCardsBySet (db, setName) {
  try {
    const collection = db.collection(cardData)

    // Query to find documents where set_name is an exact match
    // or set_code contains the provided string (case insensitive)
    const query = {
      $or: [
        caseInsensFullMatch('card_sets.set_name', setName),
        caseInsensPartMatch('card_sets.set_code', setName)
      ]
    }

    // Fetch all matching cards
    return await collection.find(query).toArray()
  } catch (err) {
    console.error('Error fetching cards:', err)
    throw new Error('Failed to fetch cards')
  }
}

// -------------------------------------------------------------

/** Fetch card by name, id, or set code */
export async function fetchCard (db, name, id, setCode) {
  try {
    const cardCollection = db.collection(cardData)

    let query = {}

    if (name) {
      query = caseInsensFullMatch('name', name)
    } else if (id) {
      query = { id: Number(id) }
    } else if (setCode) {
      query = caseInsensFullMatch('card_sets.set_code', setCode)
    }

    return await cardCollection.findOne(query)
  } catch (err) {
    console.error('Error fetching card:', err)
    throw new Error('Failed to fetch card')
  }
}

// -------------------------------------------------------------

/** Fetch card image by id from GridFS */
export async function fetchCardImageById (db, id) {
  try {
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
  } catch (err) {
    console.error('Error fetching card image:', err)
    throw new Error('Failed to fetch card image')
  }
}
