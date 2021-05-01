const request = require('supertest')
const app = require('../../app')
const Item = require('../../models/item')
const natsWarpper = require('../../natsWrapper')
const mongoose = require('mongoose')

jest.mock('../../natsWrapper')

it('has a route handler listening to /api/items for post request', async () => {
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .send({})

    expect(response.status).toEqual(401)
})

it('return a status other than 401 if user is signed in', async () => {
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({})

    expect(response.status).not.toEqual(401)
})

it('returns an error an invalid name is provided', async () => {

    const typeId = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({
            name: '',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(400)

})

it('returns an error an invalid price is provided', async () => {
    const typeId = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            size: 10,
            price: -100,
            isSold: true
        })
        .expect(400)

})

it('returns an error an invalid size is provided', async () => {
    const typeId = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            size: -10,
            price: 100,
            isSold: true
        })
        .expect(400)

})
it('creates a type with valid inputs', async () => {
    // add in a check to make sure a type was saved
    let items = await Item.find({})
    expect(items.length).toEqual(0)

    const typeId = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({
            name: 'asdf',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(201)

    items = await Item.find({})
    expect(items.length).toEqual(1)
})
