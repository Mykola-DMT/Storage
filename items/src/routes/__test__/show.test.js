const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

it('returns a 404 if the type is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .get(`/api/items/${id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(404)
})

it('can only be accessed if the user is signed in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .get(`/api/items/${id}`)
        .send()
        .expect(401)
})

it('returns the type if the type is found', async () => {
    const name = 'test'
    const size = 10
    const price = 100
    const isSold = true

    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({
            name: name,
            size: size,
            price: price,
            isSold: isSold
        })
        .expect(201)

    const itemResponse = await request(app)
        .get(`/api/items/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(200)

    expect(itemResponse.body.name).toEqual(name)
    expect(itemResponse.body.size).toEqual(size)
    expect(itemResponse.body.price).toEqual(price)
    expect(itemResponse.body.isSold).toEqual(isSold)
})