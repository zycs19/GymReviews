const User = require('../models/user');


module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Gyms!');
            return res.redirect('/gyms');
        })
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('register');
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');

    const redirectUrl = res.locals.returnTo || '/gyms';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logout');
        res.redirect('/gyms');
    });

}