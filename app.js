if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const MongoDBStore = require("connect-mongo");

const ExpressError = require("./utils/expressError");
const User = require("./models/userModel");

const dogRoutes = require("./routes/dogCRUD");
const newsRoutes = require("./routes/newsCRUD");
const homeRoutes = require("./routes/homeCRUD");
const competitionRoutes = require("./routes/competitionsCRUD");
const aboutUsRoutes = require("./routes/aboutUsCRUD");
const contactRoutes = require("./routes/contactCRUD");
const userRoutes = require("./routes/userCRUD");

const dbLocalUrl = "mongodb://localhost:27017/dogfarmsite";
const dbURL = process.env.DB_URL;
const secret = process.env.SECRET || "itreallyshoudlbeabettersecret";

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

const store = MongoDBStore.create({
  mongoUrl: dbURL,
  touchAfter: 7 * 24 * 60 * 60,
  crypto: {
    secret
  }
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/", dogRoutes);
app.use("/", newsRoutes);
app.use("/", homeRoutes);
app.use("/", competitionRoutes);
app.use("/", aboutUsRoutes);
app.use("/", contactRoutes);

app.all("*", (req, res, next) => {
  req.flash("error", "Page not found");
  return res.redirect("/home");
  next(new ExpressError("Page not found", 400));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;

  res.status(status).render("error", { err });
  //   req.flash("error", "Page you are looking for does not exist on server");
  //   return res.redirect("/home");
});

app.listen(3000, () => {
  console.log("Server active on port 3000");
});
