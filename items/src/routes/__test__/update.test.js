const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/items/${id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(404)
})

it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/items/${id}`)
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(401)
})

it('return a 401 if the user does not own the type', async () => {
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })

    await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(401)
})

it('return a 400 if the user provided an invalid inputs', async () => {
    const cookie = global.signin()
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', cookie)
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(201)

    await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'test',
            size: -10,
            price: 100,
            isSold: true
        })
        .expect(400)

    await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'test',
            size: 10,
            price: -100,
            isSold: true
        })
        .expect(400)

})

it('updates the type provided valid inputs', async () => {
    const cookie = global.signin()
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', cookie)
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(201)

    await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'new name',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(200)

    const itemsResponse = await request(app)
        .get(`/api/items/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()

    expect(itemsResponse.body.name).toEqual('new name')
})

it('set date when item sold', async () => {
    const cookie = global.signin()

    var today = new Date()
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const typeId = new mongoose.Types.ObjectId().toHexString()
    const response = await request(app)
        .post(`/api/items/${typeId}`)
        .set('Cookie', cookie)
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: false
        })
        .expect(201)

    await request(app)
        .put(`/api/items/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            name: 'new name',
            size: 10,
            price: 100,
            isSold: true
        })
        .expect(200)

    const itemsResponse = await request(app)
        .get(`/api/items/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()

    expect(itemsResponse.body.date).toEqual(date)
})