import express from "express";
import { invitationController } from "~/controllers/invitationController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { invitationValidation } from "~/validations/invitationValidation";

const Router = express.Router();

// Get all invitations by user
Router.route("/").get(
  authMiddleware.isAuthorized,
  invitationController.getInvitations
);

Router.route("/board").post(
  authMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  invitationController.createNewBoardInvitation
);

// update a record of invitation
Router.route("/board/:invitationId").put(
  authMiddleware.isAuthorized,
  invitationController.updateBoardInvitation
);

export const invitationRoute = Router;
