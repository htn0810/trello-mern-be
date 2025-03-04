import express from "express";
import { columnController } from "~/controllers/columnController";
import { columnValidation } from "~/validations/columnValidation";

const Router = express.Router();

Router.route("/").post(columnValidation.createNew, columnController.createNew);

Router.route("/:id").put(columnValidation.update, columnController.update);

Router.route("/:boardId/:columnId").delete(
  columnValidation.deleteColumnById,
  columnController.deleteColumnById
);

export const columnRoute = Router;
