import buildClient from '../api/build-client'
import Link from 'next/link'

const LandingPage = ({ currentUser, data }) => {
    const today = new Date()
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

    const itemList = data.items.map(item => {
        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.size}</td>
                <td>{item.price}</td>
                <td>{item.date}</td>
            </tr >
        )
    })

    return currentUser ? (
        <div>
            <h4>Date: {date}</h4>
            <h4>Sold today for: {data.totalToday.toFixed(2)}</h4>
            <div>
                <h2>Items:</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Size</th>
                            <th>Price</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemList}
                    </tbody>
                </table>
            </div>
        </div>
    ) : (
        <h1>You are NOT signed in</h1>
    )
}
//To fetch some data in Next.js during 
//the rendering process
LandingPage.getInitialProps = async (context, client, currentUser) => {
    if (currentUser) {
        const { data } = await client.get('/api/items')
        return { data }
    }
    return { data: { items: [] } }
}

export default LandingPage