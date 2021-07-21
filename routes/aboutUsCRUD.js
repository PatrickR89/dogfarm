const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const aboutUs = require("../controllers/aboutUsCRUD");
const { validateAboutUs, loggedIn } = require("../middleware");

const router = express.Router();

router.get("/aboutus", catchAsync(aboutUs.aboutUs));

router
  .route("/aboutus/:id")
  .put(
    upload.array("images"),
    loggedIn,
    validateAboutUs,
    catchAsync(aboutUs.editAboutUs)
  );

router.get("/aboutus/:id/edit", catchAsync(aboutUs.renderEdit));

module.exports = router;
