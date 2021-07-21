const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML"
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAtributes: {}
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.dogSchema = Joi.object({
  dog: Joi.object({
    name: Joi.string().required().escapeHTML(),
    dateOfBirth: Joi.string().required(),
    parent1: Joi.string().required().escapeHTML(),
    parent2: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    status: Joi.string().required().escapeHTML(),
    yearOfDeath: Joi.number().integer().min(1800).max(9999)
  }).required(),
  deleteImages: Joi.array()
});

module.exports.newsSchema = Joi.object({
  news: Joi.object({
    title: Joi.string().required().escapeHTML(),
    content: Joi.string().required().escapeHTML(),
    date: Joi.string()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.homeSchema = Joi.object({
  home: Joi.object({
    aboutUs: Joi.string().required().escapeHTML()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.competitionSchema = Joi.object({
  competition: Joi.object({
    name: Joi.string().required().escapeHTML(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref("startDate")).required(),
    location: Joi.string().required().escapeHTML(),
    award: Joi.string().required().escapeHTML(),
    linkTo: Joi.string().escapeHTML(),
    dog: Joi.string().required().escapeHTML()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.aboutUsSchema = Joi.object({
  aboutUs: Joi.object({
    field1Title: Joi.string().required().escapeHTML(),
    field2Title: Joi.string().required().escapeHTML(),
    field3Title: Joi.string().required().escapeHTML(),
    field1: Joi.string().required().escapeHTML(),
    field2: Joi.string().required().escapeHTML(),
    field3: Joi.string().required().escapeHTML()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.contactSchema = Joi.object({
  contact: Joi.object({
    street: Joi.string().required().escapeHTML(),
    streetNo: Joi.number().required(),
    city: Joi.string().required().escapeHTML(),
    country: Joi.string().required().escapeHTML(),
    phone: Joi.number().required(),
    email: Joi.string().required().escapeHTML(),
    faceLink: Joi.string().required().escapeHTML(),
    instaLink: Joi.string().required().escapeHTML(),
    twittLink: Joi.string().required().escapeHTML()
  }).required()
});

module.exports.messageSchema = Joi.object({
  message: Joi.object({
    name: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    message: Joi.string().required().escapeHTML()
  }).required()
});
