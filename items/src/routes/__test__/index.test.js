const { requireAuth } = require('@mdticketss/common')
const request = require('supertest')
const app = require('../../app')
//const { router } from '../new')



const createType = (cookie) => {
    return request(app)
        .post('/api/items')
        .set('Cookie', cookie)
        .send({
            name: 'test',
            size: 10,
            price: 100,
            isSold: true
        })
}

it('can only be accessed if the user is signed in', async () => {
    await request(app)
        .get('/api/items')
        .send()
        .expect(401)
})

it('can fetch a list of items', async () => {
    const cookie = global.signin()
    await createType(cookie)
    await createType(cookie)
    await createType(cookie)

    const response = await request(app)
        .get('/api/items')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})