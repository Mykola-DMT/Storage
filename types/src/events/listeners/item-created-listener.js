const Item = require('../../models/item')
const Type = require('../../models/type')

class itemCreatedListener {

    constructor(client, subject, queueGroupName) {
        this.client = client
        this.subject = subject
        this.queueGroupName = queueGroupName
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(5 * 1000)
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )

        subscription.on('message', (msg) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            )

            const parsedData = this.parseMessage(msg)

            this.onMessage(parsedData, msg)
        })
    }

    parseMessage(msg) {
        const data = msg.getData()
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'))
    }

    async onMessage(data, msg) {
        const { id, name, size, price, isSold, date, typeId } = data
        const item = new Item({
            _id: id, name, size, price, isSold, date, typeId
        })
        await item.save()

        // const type = Type.findById(typeId)
        // type.items.push(id)

        msg.ack()
    }
}

module.exports = itemCreatedListener