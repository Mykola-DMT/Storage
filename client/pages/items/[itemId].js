import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const ItemEdit = ({ item }) => {
    const [name, setName] = useState(item.name)
    const [size, setSize] = useState(item.size)
    const [price, setPrice] = useState(item.price)
    const [isSold, setIsSold] = useState(item.isSold)

    const { doRequest, errors } = useRequest({
        url: `/api/items/${item.id}/`,
        method: 'put',
        body: {
            name, size, price, isSold
        },
        onSuccess: () => Router.push(`/types/${item.typeId}`)
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
        <h1>Edit an Item</h1>
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
            <br />
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

ItemEdit.getInitialProps = async (context, client) => {
    const { itemId } = context.query
    const { data } = await client.get(`/api/items/${itemId}`)

    return { item: data }
}

export default ItemEdit