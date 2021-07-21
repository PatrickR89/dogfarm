const Competition = require("../models/competitionsModel");
const Dog = require("../models/dogModel");

const { cloudinary } = require("../cloudinary");

module.exports.renderNew = async (req, res) => {
  const dogs = await Dog.find({});
  res.render("competitions/competitionsNew", { dogs });
};

module.exports.index = async (req, res) => {
  const competitions = await Competition.find({});
  res.render("competitions/competitionsIndex", { competitions });
};

module.exports.createNew = async (req, res) => {
  const newCompetition = new Competition(req.body.competition);
  newCompetition.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  await newCompetition.save();
  req.flash("success", "Successfully created a new competition");
  res.redirect(`/competitions`);
};

module.exports.renderEdit = async (req, res) => {
  const dogs = await Dog.find({});
  const competition = await Competition.findById(req.params.id);

  if (!competition) {
    req.flash("error", "Cannot find that competition");
    return res.redirect("/competitions");
  }

  const monthStartConvert = function () {
    if (competition.startDate.getMonth() < 10) {
      const month = `0${competition.startDate.getMonth()}`;
      return month;
    } else {
      const month = competition.startDate.getMonth();
      return month;
    }
  };
  const dateStartConvert = function () {
    if (competition.startDate.getDate() < 10) {
      const day = `0${competition.startDate.getDate()}`;
      return day;
    } else {
      const day = competition.startDate.getDate();
      return day;
    }
  };

  const monthStart = monthStartConvert();
  const dayStart = dateStartConvert();

  const dateStart = `${competition.startDate.getFullYear()}-${monthStart}-${dayStart}`;

  const monthEndConvert = function () {
    if (competition.endDate.getMonth() < 10) {
      const month = `0${competition.endDate.getMonth()}`;
      return month;
    } else {
      const month = competition.endDate.getMonth();
      return month;
    }
  };
  const dateEndConvert = function () {
    if (competition.endDate.getDate() < 10) {
      const day = `0${competition.endDate.getDate()}`;
      return day;
    } else {
      const day = competition.endDate.getDate();
      return day;
    }
  };

  const monthEnd = monthEndConvert();
  const dayEnd = dateEndConvert();

  const dateEnd = `${competition.endDate.getFullYear()}-${monthEnd}-${dayEnd}`;

  res.render("competitions/competitionsEdit", {
    competition,
    dateStart,
    dateEnd,
    dogs
  });
};

module.exports.editCompetition = async (req, res) => {
  const { id } = req.params;
  const competition = await Competition.findByIdAndUpdate(id, {
    ...req.body.competition
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  competition.images.push(...imgs);
  await competition.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await competition.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    });
  }

  req.flash("success", "You have successfully updated competition");
  res.redirect(`/competitions`);
};

module.exports.deleteCompetition = async (req, res) => {
  const { id } = req.params;
  await Competition.findByIdAndDelete(id);
  req.flash("success", "Competition deleted");
  res.redirect("/competitions");
};
