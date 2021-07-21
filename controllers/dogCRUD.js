const Dog = require("../models/dogModel");
const Competition = require("../models/competitionsModel");

const { cloudinary } = require("../cloudinary");

module.exports.renderNewForm = async (req, res) => {
  const parents = await Dog.find({});
  res.render("dogCRUD/createDog", { parents });
};

module.exports.index = async (req, res) => {
  const dogs = await Dog.find({});
  res.render("dogCRUD/dogIndex", { dogs });
};

module.exports.createDogProfile = async (req, res) => {
  const newDog = new Dog(req.body.dog);
  newDog.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  await newDog.save();
  req.flash("success", "Successfully created a new dog profile");
  res.redirect(`/dogs/${newDog._id}`);
};

module.exports.dogProfile = async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  const competitions = await Competition.find({});

  if (!dog) {
    req.flash("error", "Cannot find that dog profile");
    return res.redirect("/dogs");
  }

  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();

  const ageOf = function () {
    if (dog.yearOfDeath) {
      const ageF = () => {
        if (dog.yearOfDeath - dog.dateOfBirth.getFullYear() < 1) {
          const age = "< 1";
          return age;
        } else if (dog.yearOfDeath > currentYear) {
          const age = currentYear - dog.dateOfBirth.getFullYear();
          return age;
        } else {
          const age = dog.yearOfDeath - dog.dateOfBirth.getFullYear();
          return age;
        }
      };
      const age1 = ageF();
      return age1;
    } else {
      const ageF = () => {
        if (currentYear - dog.dateOfBirth.getFullYear() < 1) {
          const age = "< 1";
          return age;
        } else {
          const age = currentYear - dog.dateOfBirth.getFullYear();
          return age;
        }
      };
      const age1 = ageF();
      return age1;
    }
  };

  const age = ageOf();

  const yearPlu = () => {
    if (age == "< 1" || age <= 1) {
      const year = "year";
      return year;
    } else {
      const year = "years";
      return year;
    }
  };

  const year = yearPlu();

  // const father = Dog.findOne({ name: dog.parent1 })
  //     .then(data => {
  //         const fatherId = data._id;
  //         console.log(fatherId);
  //         return fatherId;
  //     })

  const father = async () => {
    const father = Dog.findOne({ name: dog.parent1 });
    const value = async () => {
      return father.then((dog) => dog);
    };
    const valueIf = await value();

    if (valueIf !== null) {
      return father.then((dog) => dog._id);
    }
  };

  const fatherId = await father();

  const mother = async () => {
    const mother = Dog.findOne({ name: dog.parent2 });
    const value = async () => {
      return mother.then((dog) => dog);
    };
    const valueIf = await value();

    if (valueIf !== null) {
      return mother.then((dog) => dog._id);
    }
  };

  const motherId = await mother();

  res.render("dogCRUD/showDog", {
    dog,
    age,
    year,
    fatherId,
    motherId,
    competitions,
    currentYear
  });
};

module.exports.renderEditForm = async (req, res) => {
  const parents = await Dog.find({});
  const dog = await Dog.findById(req.params.id);

  if (!dog) {
    req.flash("error", "Cannot find that dog profile");
    return res.redirect("/dogs");
  }

  const monthConvert = function () {
    if (dog.dateOfBirth.getMonth() < 10) {
      const month = `0${dog.dateOfBirth.getMonth()}`;
      return month;
    } else {
      const month = dog.dateOfBirth.getMonth();
      return month;
    }
  };

  const dateConvert = function () {
    if (dog.dateOfBirth.getDate() < 10) {
      const day = `0${dog.dateOfBirth.getDate()}`;
      return day;
    } else {
      const day = dog.dateOfBirth.getDate();
      return day;
    }
  };

  const month = monthConvert();
  const day = dateConvert();

  const dob = `${dog.dateOfBirth.getFullYear()}-${month}-${day}`;

  res.render("dogCRUD/editDog", { dog, dob, parents });
};

module.exports.editDog = async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findByIdAndUpdate(id, { ...req.body.dog });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename
  }));
  dog.images.push(...imgs);
  await dog.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await dog.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } }
    });
  }
  req.flash("success", "You have successfully update your dog profile");
  res.redirect(`/dogs/${dog._id}`);
};

module.exports.deleteDog = async (req, res) => {
  const { id } = req.params;
  await Dog.findByIdAndDelete(id);
  req.flash("success", "Profile deleted");
  res.redirect("/dogs");
};
