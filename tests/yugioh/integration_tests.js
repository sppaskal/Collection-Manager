/* eslint-disable import/no-named-default */
import { default as chaiHttp, request } from 'chai-http'
/* eslint-enable import/no-named-default */
import * as chai from 'chai'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import fs from 'fs/promises'
import app from '../../app.js'

// To run:  npx mocha tests/yugioh/integration_tests.js --exit

/* eslint-env mocha */

const { expect } = chai
chai.use(chaiHttp)

let mongoServer
let expectedData

describe('Yugioh Routes Integration Tests', () => {
  before(async () => {
    // Start MongoDB in-memory server
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    // Check if mongoose is already connected, if so disconnect first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    // Connect to the new in-memory database
    await mongoose.connect(uri, {})

    // Load mock data from JSON file
    const mockCardsData = await fs.readFile(
      'tests/yugioh/mock_data/yugioh_cards.json', 'utf-8'
    )
    const mockImageFileData = await fs.readFile(
      'tests/yugioh/mock_data/yugioh_image_files.json', 'utf-8'
    )
    const mockImageChunkData = await fs.readFile(
      'tests/yugioh/mock_data/yugioh_image_chunks.json', 'utf-8'
    )
    const yugiohCards = JSON.parse(mockCardsData)
    const yugiohImageFiles = JSON.parse(mockImageFileData)
    const yugiohImageChunks = JSON.parse(mockImageChunkData).map(chunk => {
      chunk.data = Buffer.from(chunk.data.$binary.base64, 'base64')
      return chunk
    })

    // Insert mock data into the in-memory MongoDB
    const yugiohCardsCollection = mongoose.connection.collection(
      'yugioh_cards'
    )
    const yugiohImageFilesCollection = mongoose.connection.collection(
      'yugioh_card_images.files'
    )
    const yugiohImageChunksCollection = mongoose.connection.collection(
      'yugioh_card_images.chunks'
    )
    await yugiohCardsCollection.insertMany(yugiohCards)
    await yugiohImageFilesCollection.insertMany(yugiohImageFiles)
    await yugiohImageChunksCollection.insertMany(yugiohImageChunks)

    // Load expected data for all tests
    const expectedDataRaw = await fs.readFile(
      'tests/yugioh/mock_data/expected_data.json', 'utf-8'
    )
    expectedData = JSON.parse(expectedDataRaw)
  })

  after(async () => {
    // Close the in-memory MongoDB server
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  it('should fetch all Yugioh cards', async () => {
    const res = await request.execute(app).get('/yugioh_cards')
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(5)
    // Assert that all name properties in res.body are in expectedData.all_cards
    const allNamesInExpectedData = res.body.every(card =>
      expectedData.all_cards.includes(card.name)
    )
    expect(allNamesInExpectedData).to.equal(true)
  })

  it('should fetch Yugioh cards by set name', async () => {
    const setName = 'Battles of Legend: Armageddon'
    const res = await request.execute(app).get(`/yugioh_cards/set/${setName}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(1)
    const allNamesInExpectedData = res.body.every(card =>
      expectedData.cards_by_set.includes(card.name)
    )
    expect(allNamesInExpectedData).to.equal(true)
  })

  it('should fetch Yugioh cards by set name (code)', async () => {
    const setName = 'BLAR'
    const res = await request.execute(app).get(`/yugioh_cards/set/${setName}`)
    expect(res).to.have.status(200)
    expect(res.body).to.be.an('array')
    expect(res.body).to.have.lengthOf(1)
    const allNamesInExpectedData = res.body.every(card =>
      expectedData.cards_by_set.includes(card.name)
    )
    expect(allNamesInExpectedData).to.equal(true)
  })

  it('should fetch a single Yugioh card by name', async () => {
    const cardName = 'Obelisk the Tormentor'
    const res = await request.execute(app).get(`/yugioh_cards/name/${cardName}`)

    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.name).to.deep.equal(expectedData.card_by_name)
  })

  it('should fetch a single Yugioh card by id', async () => {
    const cardId = 10000000
    const res = await request.execute(app).get(`/yugioh_cards/${cardId}`)

    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.name).to.deep.equal(expectedData.card_by_id)
  })

  it('should fetch a single Yugioh card by set code', async () => {
    const setCode = 'CT13-EN002'
    const res = await request.execute(app).get(`/yugioh_cards/set-code/${setCode}`)

    expect(res).to.have.status(200)
    expect(res.body).to.be.an('object')
    expect(res.body.name).to.deep.equal(expectedData.card_by_set_code)
  })

  it('should fetch a Yugioh card image by id', async () => {
    const cardId = 10000010
    const res = await request.execute(app).get(`/yugioh_cards/images/${cardId}`)

    expect(res).to.have.status(200)
    expect(res.body[cardId]).to.be.a('string')
    expect(res.body[cardId]).to.deep.equal(expectedData.image_by_id)
  })
})
