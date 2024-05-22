const Gym = require('../models/gyms')

module.exports.index = async (req, res) => {
    const gyms = await Gym.find({});
    res.render('gyms/index', { gyms });
}

module.exports.renderNewForm = (req, res) => {
    res.render('gyms/new');
}

module.exports.createGym = async (req, res) => {
    const gym = new Gym(req.body.gym);
    gym.author = req.user._id;
    gym.images = {
        url: req.file.path,
        filename: req.file.filename
    }
    await gym.save();
    console.log(gym);
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
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
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