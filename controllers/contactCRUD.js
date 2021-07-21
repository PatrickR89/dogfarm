const Contact = require("../models/contactModel");
const Message = require("../models/messageModel");

module.exports.contact = async (req, res) => {
  const contact = await Contact.findOne({});

  res.render("contact/contact", { contact });
};

module.exports.renderEdit = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render("contact/editContact", { contact });
};

module.exports.editContact = async (req, res) => {
  const { id } = req.params;
  const contact = await Contact.findByIdAndUpdate(id, { ...req.body.contact });
  await contact.save();
  req.flash("success", "You have successfully update Contact page");
  res.redirect("/contact");
};

module.exports.createMessage = async (req, res) => {
  const newMessage = new Message(req.body.message);
  await newMessage.save();
  req.flash("success", "Successfully sent a message");
  res.redirect("/contact");
};

module.exports.message = async (req, res) => {
  const messages = await Message.find({});
  res.render("contact/messagesIndex", { messages });
};

module.exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  await Message.findByIdAndDelete(id);
  req.flash("success", "Message deleted");
  res.redirect("/contact/messages");
};
