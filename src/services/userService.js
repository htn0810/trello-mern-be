import { userModel } from "~/models/userModel";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatters";
import { env } from "~/config/environment";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";

/* eslint-disable no-useless-catch */
const { StatusCodes } = require("http-status-codes");
const { default: ApiError } = require("~/utils/ApiError");

const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists!");
    }
    const nameFromEmail = reqBody.email.split("@")[0];
    const newUser = {
      email: reqBody.email,
      password: bcrypt.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4(),
    };
    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;
    const customSubject =
      "Trello: Please verify your email before using our services!";
    const htmlContent = `
      <h3>Here is your verification link:</h3>
      <h3>${verificationLink}</h3>
      <h3>Sincerely, <br /> - Admin Trello - </h3>
      `;
    await BrevoProvider.sendEmail(customSubject, htmlContent, getNewUser.email);
    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
};
