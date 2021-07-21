const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const competitions = require("../controllers/competitionsCRUD");
const { validateCompetition, loggedIn } = require("../middleware");

const router = express.Router();

router.get("/competitions/new", competitions.renderNew);

router
  .route("/competitions")
  .get(catchAsync(competitions.index))
  .post(
    upload.array("images"),
    loggedIn,
    validateCompetition,
    catchAsync(competitions.createNew)
  );

router
  .route("/competitions/:id")
  .put(
    upload.array("images"),
    loggedIn,
    validateCompetition,
    catchAsync(competitions.editCompetition)
  )
  .delete(loggedIn, catchAsync(competitions.deleteCompetition));

router.get("/competitions/:id/edit", catchAsync(competitions.renderEdit));

module.exports = router;
