const nats = require('node-nats-streaming')

class NatsWrapper {
    _client

    // constructor(client){
    //     this._client = client
    // }

    get client() {
        if (!this._client) {
            return response.status(400).send({
                errors: [{ message: 'Coannot access NATS client before connecting' }]
            })
            //throw new Error('Coannot access NATS client before connecting')
        }
        return this._client
    }

    connect(clusterId, clientId, url) {
        this._client = nats.connect(clusterId, clientId, { url })

        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS')
                resolve()
            })
            this.client.on('error', (err) => {
                reject(err)
            })
        })

    }

    publish(subject, data) {
        return new Promise((resolve, reject) => {
            this.client.publish(subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err)
                }
                console.log('Event published to subject', this.subject)
                resolve()
            })
        })
    }

    async onMessage(data, msg) {
        const { id, title, price } = data
        const ticket = Ticket.build({
            id, title, price
        })
        await ticket.save()

        msg.ack()
    }

    // publish(str,data){
    //     this._client.publish(str, JSON.stringify(data), (err)=>{
    //         if(err){
    //             console.log(err)
    //         }
    //         console.log('Event published',data.title)
    //     })
    // }
}
const natsWrapper = new NatsWrapper()

module.exports = natsWrapper