import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardController } from "~/controllers/boardController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { boardValidation } from "~/validations/boardValidation";

const Router = express.Router();

Router.route("/")
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: "Get ne" });
  })
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    boardController.createNew
  );

Router.route("/:id")
  .get(authMiddleware.isAuthorized, boardController.getDetailsBoard)
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    boardController.update
  );

// API move card between different columns
Router.route("/supports/moving_card").put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardToDifferentColumns,
  boardController.moveCardToDifferentColumns
);

export const boardRoute = Router;
