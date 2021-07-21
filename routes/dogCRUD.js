const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const ExpressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const dogs = require("../controllers/dogCRUD");
const Dogs = require("../models/dogModel");
const { validateDog } = require("../middleware");

const app = express();
const router = express.Router();

router.get("/dogs/new", dogs.renderNewForm);

router
  .route("/dogs")
  .get(catchAsync(dogs.index))
  .post(upload.array("images"), validateDog, catchAsync(dogs.createDogProfile));

router
  .route("/dogs/:id")
  .get(catchAsync(dogs.dogProfile))
  .put(upload.array("images"), validateDog, catchAsync(dogs.editDog))
  .delete(catchAsync(dogs.deleteDog));

router.get("/dogs/:id/edit", catchAsync(dogs.renderEditForm));

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  req.flash("error", "Dog profile was not found");
  return res.redirect("/dogs");
});

module.exports = router;
