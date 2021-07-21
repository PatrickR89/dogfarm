const Home = require("../models/homeModel");
const News = require("../models/newsModel");

const { cloudinary } = require("../cloudinary");

module.exports.home = async (req, res) => {
  const home = await Home.findOne({});
  const news = await News.find({}).slice("news", 5);
  res.render("home/home", { home, news });
};

module.exports.renderEdit = async (req, res) => {
  const home = await Home.findOne({});
  res.render("home/editHome", { home });
};

module.exports.editHome = async (req, res) => {
  const { id } = req.params;
  const home = await Home.findByIdAndUpdate(id, { ...req.body.home });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  home.images.push(...imgs);
  await home.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await home.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    });
  }
  req.flash("success", "You have successfully update your homepage");
  res.redirect("/home");
};
