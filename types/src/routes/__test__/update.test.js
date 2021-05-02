const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

it('return a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/types/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'aafdcz'
        })
        .expect(404)
})

it('return a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/types/${id}`)
        .send({
            title: 'aafdcz'
        })
        .expect(401)
})

it('return a 401 if the user does not own the type', async () => {
    const response = await request(app)
        .post('/api/types')
        .set('Cookie', global.signin())
        .send({
            title: 'hfjdskla'
        })

    await request(app)
        .put(`/api/types/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'iewwqe'
        })
        .expect(401)
})

it('return a 400 if the user provided an invalid title', async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/types')
        .set('Cookie', cookie)
        .send({
            title: 'hfjdskla'
        })

    await request(app)
        .put(`/api/types/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: ''
        })
        .expect(400)

})

it('updates the type provided valid inputs', async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/types')
        .set('Cookie', cookie)
        .send({
            title: 'hfjdskla'
        })

    await request(app)
        .put(`/api/types/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title'
        })
        .expect(200)

    const typeResponse = await request(app)
        .get(`/api/types/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()

    expect(typeResponse.body.type.title).toEqual('new title')
})