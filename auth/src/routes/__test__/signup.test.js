const request = require('supertest')
const app = require('../../app')

it('returns a 201 on succesful signup', async () => {
    return request(app)
    .post('/api/users/signup')
     .send({
        email: 'test@test.com',
        password: 'test'
    })
    .expect(201)
})