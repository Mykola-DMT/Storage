const { requireAuth } = require('@mdticketss/common')
const request = require('supertest')
const app = require('../../app')
//const { router } from '../new')

const createType = () => {
    return request(app)
        .post('/api/types')
        .set('Cookie', global.signin())
        .send({
            title: 'test'
        })
}

it('can only be accessed if the user is signed in', async()=>{
    await request(app)
        .get('/api/types')
        .send()
        .expect(401)
})

it('can fetch a list of types', async () => {
    await createType()
    await createType()
    await createType()

    const response = await request(app)
        .get('/api/types')
        .set('Cookie', global.signin())
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})