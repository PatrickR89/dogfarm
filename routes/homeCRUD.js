const express = require('express');
const multer = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const catchAsync = require('../utils/catchAsync');
const home = require('../controllers/homeCRUD')
const { validateHome } = require('../middleware')

const router = express.Router()

router.get('/home', catchAsync(home.home))

router.route('/home/:id')
    .put(upload.array('images'), validateHome, catchAsync(home.editHome))

router.get('/home/:id/edit', catchAsync(home.renderEdit))

module.exports = router;