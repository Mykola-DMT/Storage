import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { errors, doRequest } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    })

    const onSubmit = async (event) => {
        event.preventDefault()

        await doRequest()
    }

    return (
        <form onSubmit={onSubmit} className="container">
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    style={{ width: '75%' }}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    style={{ width: '75%' }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="password"
                    className="form-control"
                    placeholder="Password"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>)
}
