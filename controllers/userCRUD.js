const User = require("../models/userModel");

module.exports.renderRegister = (req, res) => {
  res.render("user/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome!");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/home";
  res.redirect(redirectUrl);
  delete req.session.returnTo;
};

module.exports.logout = (req, res) => {
  req.logout();
  res.redirect("/home");
};
