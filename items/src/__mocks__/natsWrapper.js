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

//export default natsWrapper

module.exports = natsWrapper