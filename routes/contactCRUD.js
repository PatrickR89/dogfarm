const express = require("express");

const catchAsync = require("../utils/catchAsync");
const contact = require("../controllers/contactCRUD");
const { validateContact, validateMessage, loggedIn } = require("../middleware");

const router = express.Router();

router.get("/contact", catchAsync(contact.contact));

router
  .route("/contact/messages")
  .get(catchAsync(contact.message))
  .post(validateMessage, catchAsync(contact.createMessage));

router.delete(
  "/contact/messages/:id",
  loggedIn,
  catchAsync(contact.deleteMessage)
);

router
  .route("/contact/:id")
  .put(loggedIn, validateContact, catchAsync(contact.editContact));

router.get("/contact/:id/edit", catchAsync(contact.renderEdit));

module.exports = router;
