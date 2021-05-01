import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import Link from 'next/link'

const TypeShow = ({ type, items }) => {
    const itemList = items.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.size}</td>
                <td>{item.price}</td>
                <td>{item.date}</td>
                < td >
                    <Link className="disabled-link" href="/items/[itemId]" as={`/items/${item.id}`}>
                        <button
                            type="button"
                            className="btn btn-primary  btn-sm"
                            disabled={!!item.date}
                        >Edit</button>
                    </Link>
                </td >

            </tr >
        )
    })

    return <div>
        <h1 align="center">{type.title}</h1>
        <div className="d-flex flex-row flex-wrap justify-content-between">
            <Link href="/items/new/[typeId]" as={`/items/new/${type.id}`}>
                <button className="btn btn-outline-success">Add Item</button>
            </Link>
            <Link href="/types/edit/[typeId]" as={`/types/edit/${type.id}`}>
                <button className="btn btn-primary  btn-sm">Rename</button>
            </Link>
        </div>
        <h2>Items:</h2>
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Date</th>
                    {/* <th>isSold</th> */}
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {itemList}
            </tbody>
        </table>
    </div>
}

TypeShow.getInitialProps = async (context, client) => {
    const { typeId } = context.query
    const { data } = await client.get(`/api/types/${typeId}`)

    return { type: data.type, items: data.items }
}

export default TypeShow