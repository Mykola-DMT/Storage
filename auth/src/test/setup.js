const request = require('supertest')
const {MongoMemoryServer} = require('mongodb-memory-server')
const mongoose = require('mongoose')
const { response } = require('../app')
const app = require('../app')

let mongo
beforeAll(async() => {
    process.env.jwt_key = 'asdfasdf'

    mongo = new MongoMemoryServer
    const mongoUri = await mongo.getUri()

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
})

beforeEach(async() => {
    const collections = await mongoose.connection.db.collections()

    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async() => {
    await mongo.stop()
    await mongoose.connection.close()
})

global.signup = async () => {
    const email = 'test@test.com'
    const password = 'test'

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201)
    const cookie = response.get('Set-Cookie')

    return cookie
}