import { MongoClient } from 'mongodb'

const renderTestMode = true

const uri = 'mongodb://localhost:27017'
const databaseName = 'collection_manager_db'
const cardData = 'yugioh_cards'
const cardImageMetadata = 'yugioh_card_images.files'
const cardImageChunks = 'yugioh_card_images.chunks'

// Get all cards
export async function getCards (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const collection = db.collection(cardData)

    const cards = await collection.find({}).toArray()

    res.json(cards)
  } catch (err) {
    console.error('Error fetching data:', err)
    res.status(500).json({ error: 'Failed to fetch cards' })
  } finally {
    await client.close()
  }
}

// Get a card by either 'name' or 'id' and include image data
export async function getCardByNameOrId (req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db(databaseName)
    const cardCollection = db.collection(cardData)
    const imageFilesCollection = db.collection(cardImageMetadata)
    const imageChunksCollection = db.collection(cardImageChunks)

    const { name, id } = req.params

    let query = {}

    // Query card by either name (case insensitive) or id
    if (name) {
      query = { name: { $regex: new RegExp(`^${name}$`, 'i') } }
    } else if (id) {
      query = { id: Number(id) }
    }

    const card = await cardCollection.findOne(query)

    if (!card) {
      return res.status(404).json({ error: 'Card not found' })
    }

    // Retrieve the associated image file from GridFS
    const imageFile = await imageFilesCollection.findOne({ _id: String(card.id) })

    if (!imageFile) {
      // If no image is found, return the card without an image
      return res.json(card)
    }

    // Retrieve the image data from GridFS chunks
    const downloadStream = imageChunksCollection.find({ files_id: imageFile._id }).sort({ n: 1 })

    // Buffer to store the image data
    const imageData = []
    for await (const chunk of downloadStream) {
      imageData.push(chunk.data.buffer)
    }

    // Combine the chunks into a single buffer
    const imageBuffer = Buffer.concat(imageData)

    // Attach the image as base64-encoded data
    const imageBase64 = `data:${imageFile.contentType};base64,${imageBuffer.toString('base64')}`
    card.image = imageBase64

    if (renderTestMode) {
      // Render an HTML response to display the image
      res.send(`
            <html>
            <body>
                <h1>${card.name}</h1>
                <h2>${card.type}</h2>
                <h2>${card.race}</h2>
                <h2>${card.ygoprodeck_url}</h2>
                <h2>${card.desc}</h2>
                <img src="${imageBase64}" alt="${card.name}" />
            </body>
            </html>
        `)
    } else {
      // Json response
      res.json(card)
    }
  } catch (err) {
    console.error('Error fetching card:', err)
    res.status(500).json({ error: 'Failed to fetch card' })
  } finally {
    await client.close()
  }
}
