const News = require("../models/newsModel");
const { cloudinary } = require("../cloudinary");

module.exports.renderNewForm = (req, res) => {
  res.render("news/createNews");
};

module.exports.createNew = async (req, res) => {
  const newNews = new News(req.body.news);
  newNews.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  const currentTime = new Date();
  console.log(currentTime);
  newNews.date = new Date();
  await newNews.save();
  req.flash("success", "Succesfully created news");
  res.redirect(`/news/${newNews._id}`);
};

module.exports.newsProfile = async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    req.flash("error", "There are no such news!");
    return res.redirect("/news");
  }

  res.render("news/showNews", { news });
};

module.exports.newsIndex = async (req, res) => {
  const news = await News.find({});
  res.render("news/indexNews", { news });
};

module.exports.renderEdit = async (req, res) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    req.flash("error", "There are no such news!");
    return res.redirect("/news");
  }

  res.render("news/editNews", { news });
};

module.exports.editNews = async (req, res) => {
  const { id } = req.params;
  const news = await News.findByIdAndUpdate(id, { ...req.body.news });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));

  news.images.push(...imgs);
  await news.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await news.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    });
  }
  req.flash("success", "News successfully updated");
  res.redirect(`/news/${news._id}`);
};

module.exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  await News.findByIdAndDelete(id);
  req.flash("success", "News deleted");
  res.redirect("/news");
};
