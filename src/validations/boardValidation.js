import ApiError from "~/utils/ApiError";
import { BOARD_TYPES } from "~/utils/constants";

const { StatusCodes } = require("http-status-codes");
const Joi = require("joi");

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "any.required": "Title is required!",
      "string.empty": "Title is not allowed to be empty!",
      "string.min": "Title min 3 chars!",
      "string.max": "Title max 50 chars!",
      "string.trim": "Title must not have leading or trailing whitespace!",
    }),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string()
      .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
      .required(),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const boardValidation = {
  createNew,
};
