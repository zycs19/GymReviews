const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateGym, isAuthor } = require('../middleware')
const gyms = require('../controllers/gyms')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(gyms.index))
    .post(isLoggedIn, upload.array('image', 100), validateGym, catchAsync(gyms.createGym));

router.get('/new', isLoggedIn, gyms.renderNewForm)
router.route('/:id')
    .get(catchAsync(gyms.showGym))
    .put(isLoggedIn, isAuthor, upload.array('image', 100), validateGym, catchAsync(gyms.updateGym))
    .delete(isLoggedIn, isAuthor, catchAsync(gyms.deleteGym))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gyms.renderEditForm))

module.exports = router;