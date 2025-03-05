const Joi = require("joi");
const { verify } = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { GET_DB } = require("~/config/mongodb");
const { EMAIL_RULE, EMAIL_RULE_MESSAGE } = require("~/utils/validators");

const USER_ROLES = {
  CLIENT: "client",
  ADMIN: "admin",
};

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string()
    .required()
    .pattern(EMAIL_RULE)
    .message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string()
    .valid(USER_ROLES.ADMIN, USER_ROLES.CLIENT)
    .default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "email", "username", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdUser = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validData);
    return createdUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(String(userId)) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: email });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(userId)) },
        { $set: updateData },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  createNew,
  findOneById,
  findOneByEmail,
  update,
};
