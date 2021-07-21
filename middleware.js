const {
  dogSchema,
  newsSchema,
  homeSchema,
  competitionSchema,
  aboutUsSchema,
  contactSchema,
  messageSchema
} = require("./validationSchema");

const ExpressError = require("./utils/ExpressError");

module.exports.loggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateDog = (req, res, next) => {
  const { error } = dogSchema.validate(req.body);
  if (error) {
    const msg = "Dog form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateNews = (req, res, next) => {
  const { error } = newsSchema.validate(req.body);
  if (error) {
    const msg = "News form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateHome = (req, res, next) => {
  const { error } = homeSchema.validate(req.body);
  if (error) {
    const msg = "Home form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateCompetition = (req, res, next) => {
  const { error } = competitionSchema.validate(req.body);
  if (error) {
    const msg = "Competition form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateAboutUs = (req, res, next) => {
  const { error } = aboutUsSchema.validate(req.body);
  if (error) {
    const msg = "About us form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateContact = (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    const msg = "Contact form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body);
  if (error) {
    const msg = "Message form not filled properly, please try again!";
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
