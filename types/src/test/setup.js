const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const request = require('supertest')
const { app } = require('../app')
const jwt = require('jsonwebtoken')
//const jest = require('jest')

jest.mock('../natsWrapper')

let mongo
beforeAll(async () => {
    process.env.jwt_key = 'asdfasdf'

    mongo = new MongoMemoryServer
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async () => {
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin = (userId = undefined) => {
    //build a JWT payload. {id, email}
    const payload = {
        id: userId || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    //create the JWT
    const token = jwt.sign(payload, process.env.jwt_key)

    //build session Object {jwt: my-jwt}
    const session = { jwt: token }

    //turn that session into JSON
    const sessionJSON = JSON.stringify(session)

    //Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64')

    //return a string thats the cookie wiht the encoded data
    return [`express:sess=${base64}`]
}