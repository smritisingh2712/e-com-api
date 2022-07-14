const mongoose = require('mongoose')
const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'please provide rating']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide review title']
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text'],
        maxlength: 100,

    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true })
//user can only give one review to one product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
//for aggrigation
ReviewSchema.statics.calculateAverageRating = async function (prodctId) {
    const result = await this.aggregate([
        { $match: { product: prodctId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 }
            },
        },
    ]);
    //console.log(result)
    try {
        await this.model('Product').findOneAndUpdate({ _id: prodctId },
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0
            })
    }
    catch (error) { console.log(error) }
}
ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)