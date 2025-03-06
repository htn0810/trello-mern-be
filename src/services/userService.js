import { userModel } from "~/models/userModel";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pickUser } from "~/utils/formatters";
import { env } from "~/config/environment";
import { WEBSITE_DOMAIN } from "~/utils/constants";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { JwtProvider } from "~/providers/JwtProvider";

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

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already active!"
      );
    if (reqBody.token !== existUser.verifyToken)
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid!");

    const updateData = {
      isActive: true,
      verifyToken: null,
    };

    const updatedUser = await userModel.update(existUser._id, updateData);
    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser)
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!");
    if (!existUser.isActive)
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active!"
      );
    if (!bcrypt.compareSync(reqBody.password, existUser.password)) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your email/password is not correct!"
      );
    }

    const userInfo = {
      _id: existUser._id,
      emali: existUser.email,
    };

    // create accessToken & refreshToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      5
      // env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      10
      // env.REFRESH_TOKEN_LIFE
    );

    return {
      accessToken,
      refreshToken,
      ...pickUser(existUser),
    };
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      5
      // env.ACCESS_TOKEN_LIFE
    );
    return { accessToken };
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
};
