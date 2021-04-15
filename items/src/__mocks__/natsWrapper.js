const natsWrapper = {
    publish: jest.fn().mockImplementation(
        (subject, data, callback) => {
            callback()
        }
    ),
    client: {
        // publish: (subject: string, data: string, callback: () => void) => {
        //     callback()
        // }
        publish: jest.fn().mockImplementation(
            (subject, data, callback) => {
                console.log('uses fake nats client')
                callback()
            }
        )
    }
}

console.log('Connected to NATS _fake')
//export default natsWrapper

module.exports = natsWrapper