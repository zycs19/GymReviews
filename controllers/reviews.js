const Review = require('../models/review');
const Gym = require('../models/gyms');


module.exports.createReview = async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash('success', 'Successfully created a new review.');
    return res.redirect(`/gyms/${gym._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.body.review);
    req.flash('success', 'review deleted.');
    return res.redirect(`/gyms/${id}`)
}