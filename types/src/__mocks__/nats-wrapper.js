const natsWrapper = {
    client: {
        // publish: (subject: string, data: string, callback: () => void) => {
        //     callback()
        // }
        publish: jest.fn().mockImplementation(
            (subject, data, callback) => {
                callback()
            }
        )
    }
}

module.exports = natsWrapper