const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
//const { router } from '../new')

const createType = (userId) => {
    return request(app)
        .post('/api/types')
        .set('Cookie', global.signin(userId))
        .send({
            title: 'test'
        })
}

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .get('/api/types')
        .send()
        .expect(401)
})

it('can fetch a list of types', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString()
    await createType(userId)
    await createType(userId)
    await createType(userId)

    const response = await request(app)
        .get('/api/types')
        .set('Cookie', global.signin(userId))
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})