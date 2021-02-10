const request = require('supertest')
const app = require('../../app')

it('fails when a email does not exist is supplied', async() =>{
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'test'
        })
        .expect(400)
})

it('fails when an incorrect password is supplied', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'test'
        })
        .expect(201)
    
        await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'asdfghj'
            })
            .expect(400)
})

it('responds with a cookie when given valid credentials ', async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'test'
        })
        .expect(201)
    
        const response = await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'test'
            })
            .expect(200)
        expect(response.get('Set-Cookie')).toBeDefined()
})