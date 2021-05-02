import { useState } from 'react'
import useRequest from '../../../hooks/use-request'
import Router from 'next/router'

const NewItem = ({ typeId, currentUser }) => {
    const [name, setName] = useState('')
    const [size, setSize] = useState('')
    const [price, setPrice] = useState('')
    const [isSold, setIsSold] = useState(false)

    const { doRequest, errors } = useRequest({
        url: `/api/items/${typeId}/`,
        method: 'post',
        body: {
            name, size, price, isSold
        },
        onSuccess: () => Router.push(`/types/${typeId}`, null, { shallow: true })
    })

    const onSubmit = (event) => {
        event.preventDefault()

        doRequest()
    }

    const onBlur = () => {
        const value = parseFloat(price)

        if (isNaN(value)) {
            return
        }

        setPrice(value.toFixed(2))
    }
    return <div>
        <h1>Create an Item</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Size</label>
                <input
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Price</label>
                <input
                    value={price}
                    onBlur={onBlur}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    id="flexCheckDefault"
                    type="checkbox"
                    value={isSold}
                    onChange={(e) => setIsSold(e.target.value)}
                />
                <label className="form-check-label">Is Sold</label>
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

NewItem.getInitialProps = async (context, client) => {
    const { typeId } = context.query
    return { typeId }
}
export default NewItem