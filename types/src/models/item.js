const { Schema, Types, model } = require('mongoose')

const itemSchema = new Schema({
    name: { type: String, required: true },
    size: { type: Schema.Types.Mixed, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: false },
    isSold: { type: Boolean, required: true },
    typeId: { type: Types.ObjectId, ref: 'Type' }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

module.exports = model('Item', itemSchema)