import { useState } from 'react'
import useRequest from '../../../hooks/use-request'
import Router from 'next/router'

const EditType = ({ type }) => {
    const [title, setTitle] = useState(type.title)

    const { doRequest, errors } = useRequest({
        url: `/api/types/${type.id}`,
        method: 'put',
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
            Rename
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
            <button className="btn btn-primary">Rename</button>
        </form>
    </div>
}

EditType.getInitialProps = async (context, client) => {
    const { typeId } = context.query
    const { data } = await client.get(`/api/types/${typeId}`)

    return { type: data.type }
}

export default EditType