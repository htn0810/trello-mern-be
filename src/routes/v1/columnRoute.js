import express from "express";
import { columnController } from "~/controllers/columnController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { columnValidation } from "~/validations/columnValidation";

const Router = express.Router();

Router.route("/").post(
  authMiddleware.isAuthorized,
  columnValidation.createNew,
  columnController.createNew
);

Router.route("/:id").put(
  authMiddleware.isAuthorized,
  columnValidation.update,
  columnController.update
);

Router.route("/:boardId/:columnId").delete(
  authMiddleware.isAuthorized,
  columnValidation.deleteColumnById,
  columnController.deleteColumnById
);

export const columnRoute = Router;
