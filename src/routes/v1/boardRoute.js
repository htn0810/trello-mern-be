import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "~/controllers/boardController";
import { boardValidation } from "~/validations/boardValidation";

const Router = express.Router();

Router.route("/")
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: "Get ne" });
  })
  .post(boardValidation.createNew, boardController.createNew);

Router.route("/:id").get(boardController.getDetailsBoard).put();

export const boardRoute = Router;
