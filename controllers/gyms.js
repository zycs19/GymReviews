const Gym = require('../models/gyms')
const { cloudinary } = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms });
}

module.exports.renderNewForm = (req, res) => {
    res.render('gyms/new');
}

module.exports.createGym = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.gym.location,
        limit: 1
    }).send()
    const gym = new Gym(req.body.gym);
    gym.author = req.user._id;
    gym.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    gym.geometry = geoData.body.features[0].geometry;

    await gym.save();
    req.flash('success', 'Successfully made a new gym.');
    res.redirect(`/gyms/${gym._id}`);

}

module.exports.showGym = async (req, res) => {
    const id = req.params.id;
    const gym = await Gym.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!gym) {
        req.flash('error', 'Cannot find that Gym');
        return res.redirect('/gyms');
    }
    return res.render('gyms/show', { gym });
}

module.exports.updateGym = async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.images.push(...newImages);
    await gym.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(gym)
    }
    req.flash('success', 'Successfully updated a gym.');
    return res.redirect(`/gyms/${gym._id}`);
}

module.exports.deleteGym = async (req, res) => {
    await Gym.findByIdAndDelete(req.params.id);
    req.flash('success', 'Gym deleted.');
    res.redirect('/gyms')
}

module.exports.renderEditForm = async (req, res) => {
    const id = req.params.id;
    const gym = await Gym.findById(id);
    if (!gym) {
        req.flash('error', 'Cannot find that Gym');
        return res.redirect('/gyms');
    }

    res.render(`gyms/edit`, { gym });
}