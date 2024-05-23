const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const GymSchema = new Schema({
    title: { type: String, required: true },
    type: String,
    price: Number,
    location: String,
    description: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
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
}, opts);

GymSchema.virtual('properties.popUpMarkup').get(function () {
    const text = `${this.title}`;
    return text;
})

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