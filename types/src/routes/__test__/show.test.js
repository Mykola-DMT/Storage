const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')

it('returns a 404 if the type is not found', async() => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .get(`/api/types/${id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(404)
})

it('can only be accessed if the user is signed in', async()=>{
    await request(app)
        .get('/api/types')
        .send()
        .expect(401)
})

it('returns the type if the type is found', async() => {
    const title= 'concert'

    const response = await request(app)
        .post('/api/types')
        .set('Cookie', global.signin())
        .send({
            title
        })
        .expect(201)

    const typeResponse = await request(app)
        .get(`/api/types/${response.body.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(200)
    
    expect(typeResponse.body.title).toEqual(title)
})