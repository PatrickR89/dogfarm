const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const catchAsync = require("../utils/catchAsync");
const news = require("../controllers/newsCRUD");
const { validateNews, loggedIn } = require("../middleware");

const router = express.Router();

router.get("/news/new", news.renderNewForm);

router
  .route("/news")
  .get(catchAsync(news.newsIndex))
  .post(
    upload.array("images"),
    loggedIn,
    validateNews,
    catchAsync(news.createNew)
  );

router
  .route("/news/:id")
  .get(catchAsync(news.newsProfile))
  .put(
    upload.array("images"),
    loggedIn,
    validateNews,
    catchAsync(news.editNews)
  )
  .delete(loggedIn, catchAsync(news.deleteNews));

router.get("/news/:id/edit", catchAsync(news.renderEdit));

module.exports = router;
