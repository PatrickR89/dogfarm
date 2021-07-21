const AboutUs = require("../models/aboutUsModel");

const { cloudinary } = require("../cloudinary");

module.exports.aboutUs = async (req, res) => {
  const aboutUs = await AboutUs.findOne({});

  res.render("aboutUs/aboutUs", { aboutUs });
};

module.exports.renderEdit = async (req, res) => {
  const aboutUs = await AboutUs.findOne({});

  if (!aboutUs) {
    req.flash("error", "Only one About Us page available!");
    return res.redirect("/aboutus");
  }

  res.render("aboutus/aboutUsEdit", { aboutUs });
};

module.exports.editAboutUs = async (req, res) => {
  const { id } = req.params;
  const aboutUs = await AboutUs.findByIdAndUpdate(id, { ...req.body.aboutUs });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  aboutUs.images.push(...imgs);
  await aboutUs.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await aboutUs.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    });
  }
  req.flash("success", "You have successfully update About Us page");
  res.redirect("/aboutus");
};
