const request = require('supertest')
const app = require('../../app')
const Type = require('../../models/type')

it('has a route handler listening to /api/types for post request', async() => {
    const response = await request(app)
        .post('/api/types')
        .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async() => {
    const response = await request(app)
        .post('/api/types')
        .send({})

    expect(response.status).toEqual(401)
})

it('return a status other than 401 if user is signed in', async() => {
    const response = await request(app)
        .post('/api/types')
        .set('Cookie', global.signin())
        .send({})

    expect(response.status).not.toEqual(401)
})

it('returns an error an invalid title is provided', async() => {
    await request(app)
        .post('/api/types')
        .set('Cookie', global.signin())
        .send({
            title: ''
        })
        .expect(400)

})

// it('returns an error if an invalid price is invalid', async() => {
//     await request(app)
//         .post('/api/types')
//         .set('Cookie', global.signin())
//         .send({
//             title: 'acdxz'
//         })
//         .expect(400)

//     await request(app)
//         .post('/api/types')
//         .set('Cookie', global.signin())
//         .send({
//             title: 'sfssv'
//         })
//         .expect(400)
// })

it('creates a type with valid inputs', async() => {
// add in a check to make sure a type was saved
    let types = await Type.find({})
    expect(types.length).toEqual(0)

    await request(app)
        .post('/api/types')
        .set('Cookie', global.signin())
        .send({
            title: 'asdf'
        })
        .expect(201)
        
    types = await Type.find({})
    expect(types.length).toEqual(1)
})