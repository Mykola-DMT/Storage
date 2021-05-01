import Link from 'next/link'

const TypeIndex = ({ types }) => {

    return (
        <div>
            <Link href="/types/new">
                <button className="btn btn-outline-success">Add Type</button>
            </Link>
            <br />
            <hr />
            <div className="d-flex flex-row flex-wrap justify-content-between">
                {types.map(type => {
                    return <div
                        className="card"
                        style={{ marginBottom: '20px' }}
                        key={type.id}
                    >
                        <Link href="/types/[typeId]" as={`/types/${type.id}`}>
                            <div className="card-body">
                                <h3>{type.title}</h3>
                                <a></a>
                            </div>
                        </Link>
                    </div>
                })}
            </div>
        </div>)
}

TypeIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get('/api/types')

    return { types: data }
}

export default TypeIndex