import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const NewType = () => {
    const [title, setTitle] = useState('')

    const { doRequest, errors } = useRequest({
        url: '/api/types',
        method: 'post',
        body: {
            title
        },
        onSuccess: () => Router.push('/types')
    })

    const onSubmit = (event) => {
        event.preventDefault()

        doRequest()
    }

    return <div>
        <h1>
            Create a Type
        </h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default NewType