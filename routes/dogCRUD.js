const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const dogs = require("../controllers/dogCRUD");
const Dogs = require("../models/dogModel");
const { validateDog, loggedIn } = require("../middleware");

const app = express();
const router = express.Router();

router.get("/dogs/new", dogs.renderNewForm);

router
  .route("/dogs")
  .get(catchAsync(dogs.index))
  .post(
    upload.array("images"),
    loggedIn,
    validateDog,
    catchAsync(dogs.createDogProfile)
  );

router
  .route("/dogs/:id")
  .get(catchAsync(dogs.dogProfile))
  .put(upload.array("images"), loggedIn, validateDog, catchAsync(dogs.editDog))
  .delete(loggedIn, catchAsync(dogs.deleteDog));

router.get("/dogs/:id/edit", catchAsync(dogs.renderEditForm));

module.exports = router;
