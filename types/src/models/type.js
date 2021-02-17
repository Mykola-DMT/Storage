const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    items: [{type: mongoose.Types.ObjectId, ref:'Item'}],
    userId: {type: String, required: true}
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

module.exports = mongoose.model('Type', typeSchema)