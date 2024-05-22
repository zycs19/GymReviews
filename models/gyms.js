const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const GymSchema = new Schema({
    title: { type: String, required: true },
    type: String,
    price: Number,
    location: String,
    description: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

GymSchema.post('findOneAndDelete', async function (gym) {
    if (gym) {
        await Review.deleteMany({
            _id: {
                $in: gym.reviews
            }
        })
    }
})

module.exports = mongoose.model('Gym', GymSchema);