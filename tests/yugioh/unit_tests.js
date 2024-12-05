import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { expect } from 'chai'
import sinon from 'sinon'

import service from '../../services/yugioh_services.js'
import YugiohCard from '../../models/yugioh/card.js'

// To run: npx mocha tests/yugioh/unit_tests.js

/* eslint-env mocha */

describe('Yugioh Service Layer Tests', () => {
  let mongoServer
  let sandbox

  before(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    // Connect mongoose to the in-memory database
    await mongoose.connect(uri)
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    // Restore the sinon sandbox after each test
    sandbox.restore()
  })

  after(async () => {
    // Disconnect and stop the in-memory server
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  describe('fetchCards', () => {
    it('should return all cards', async () => {
      const mockCards = [
        { name: 'Blue-Eyes White Dragon', atk: 3000, def: 2500 },
        { name: 'Dark Magician', atk: 2500, def: 2100 }
      ]

      // Stub YugiohCard.find to return mock data
      sandbox.stub(YugiohCard, 'find').returns(Promise.resolve(mockCards))

      const result = await service.fetchCards()
      expect(result).to.deep.equal(mockCards)
    })
  })

  describe('fetchCardsBySet', () => {
    // Set mock data
    const setName = 'Legend of Blue Eyes White Dragon'
    const setCode = 'LOB-001'
    const mockCards = [
      {
        name: 'Blue-Eyes White Dragon',
        card_sets: [
          { set_name: setName, set_code: setCode }
        ]
      }
    ]

    // Stub database behavior
    function stubSearchBySet () {
      sandbox.stub(YugiohCard, 'find').callsFake((query) => {
        const orConditions = query.$or || []

        // Check if each condition in the $or array
        // matches a set name or a set code
        for (const condition of orConditions) {
          const key = Object.keys(condition)[0]
          const regex = condition[key].$regex
          if (regex.test(setName) || regex.test(setCode)) {
            return Promise.resolve(mockCards)
          }
        }
        return null
      })
    }

    it('should return cards matching set name', async () => {
      stubSearchBySet()
      const result = await service.fetchCardsBySet(setName)
      expect(result).to.deep.equal(mockCards)
    })

    it('should return cards matching set code', async () => {
      stubSearchBySet()
      const result = await service.fetchCardsBySet('lob')
      expect(result).to.deep.equal(mockCards)
    })
  })

  describe('fetchCard', () => {
    const cardName = 'Dark Magician'
    const cardId = 10000
    const setCode = 'SDY-001'
    const mockCard = {
      id: cardId,
      name: cardName,
      atk: 2500,
      def: 2100,
      card_sets: [{ set_code: setCode }]
    }

    it('should return a card by name', async () => {
      sandbox.stub(YugiohCard, 'findOne').callsFake((query) => {
        if (query.name.$regex.test(cardName)) {
          return { lean: () => Promise.resolve(mockCard) }
        } else {
          return { lean: () => null }
        }
      })

      const result = await service.fetchCard(cardName)
      expect(result).to.deep.equal(mockCard)
    })

    it('should return a card by id', async () => {
      sandbox.stub(YugiohCard, 'findOne').callsFake((query) => {
        if (query.id === cardId) {
          return { lean: () => Promise.resolve(mockCard) }
        } else {
          return { lean: () => null }
        }
      })

      const result = await service.fetchCard(null, cardId, null)
      expect(result).to.deep.equal(mockCard)
    })

    it('should return a card by set code', async () => {
      sandbox.stub(YugiohCard, 'findOne').callsFake((query) => {
        if (query['card_sets.set_code'].$regex.test(setCode)) {
          return { lean: () => Promise.resolve(mockCard) }
        } else {
          return { lean: () => null }
        }
      })

      const result = await service.fetchCard(null, null, setCode)
      expect(result).to.deep.equal(mockCard)
    })
  })

  describe('fetchCardImageById', () => {
    it('should return base64 image string by id', async () => {
      const imageId = '10000'
      const mockFile = { _id: imageId, contentType: 'image/png' }
      const mockChunks = [
        {
          data: {
            buffer: Buffer.from('aaa', 'base64')
          }
        },
        {
          data: {
            buffer: Buffer.from('bbb', 'base64')
          }
        }
      ]

      // Mocking the files collection
      const mockFilesCollection = {
        findOne: sandbox.stub().callsFake((query) => {
          if (query._id === imageId) {
            return Promise.resolve(mockFile)
          } else {
            return Promise.resolve(null)
          }
        })
      }

      // Mocking the chunks collection
      const mockChunksCollection = {
        find: sandbox.stub().callsFake((query) => {
          if (query.files_id === mockFile._id) {
            return {
              sort: () => ({
                [Symbol.asyncIterator]: async function * () {
                  for (const chunk of mockChunks) {
                    yield chunk
                  }
                }
              })
            }
          } else {
            return null
          }
        })
      }

      // Mock db.collection() to return these mock collections
      const db = mongoose.connection.db
      sandbox.stub(db, 'collection').callsFake((name) => {
        if (name === 'yugioh_card_images.files') {
          return mockFilesCollection
        } else if (name === 'yugioh_card_images.chunks') {
          return mockChunksCollection
        }
      })

      // Call the service function and assert
      const result = await service.fetchCardImagesByIds(imageId)
      const expectedBase64 = 'data:image/png;base64,aaZttg=='

      expect(result[imageId]).to.equal(expectedBase64)

      sinon.assert.calledOnce(mockFilesCollection.findOne)
      sinon.assert.calledOnce(mockChunksCollection.find)
    })
  })
})
