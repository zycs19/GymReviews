if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//console.log(process.env.CLOUDINARY_CLOUD_NAME)

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const gymRoutes = require('./routes/gyms');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const MongoStore = require('connect-mongo')(session);

const dbUrl = process.env.DB_URL;
const PORT = process.env.PORT || 3500
//const dbUrl = process.env.DB_URL_LOCAL


mongoose.connect(dbUrl);

//mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected.");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionStore = new MongoStore({
    url: dbUrl,
    secret: 'thisshouldbebettersecret',
    touchAfter: 24 * 60 * 60
});

sessionStore.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store: sessionStore,
    secret: 'thisshouldbebettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.use('/', userRoutes);
app.use('/gyms', gymRoutes);
app.use('/gyms/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "something went wrong" } = err;
    if (!err.message) {
        err.message = 'Oh No... Something Went Wrong!';
    }
    res.status(statusCode).render('error', { err });
})
app.listen(PORT, () => {
    console.log('serving on port ', PORT);
})