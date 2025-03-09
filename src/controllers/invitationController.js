import { StatusCodes } from "http-status-codes";
import { inviationService } from "~/services/invitationService";

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id;
    const resInviation = await inviationService.createNewBoardInvitation(
      req.body,
      inviterId
    );
    res.status(StatusCodes.CREATED).json(resInviation);
  } catch (error) {
    next(error);
  }
};

const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const resInviations = await inviationService.getInvitations(userId);
    res.status(StatusCodes.OK).json(resInviations);
  } catch (error) {
    next(error);
  }
};

const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { invitationId } = req.params;
    const { status } = req.body;
    const updatedInvitation = await inviationService.updateBoardInvitation(
      userId,
      invitationId,
      status
    );
    res.status(StatusCodes.OK).json(updatedInvitation);
  } catch (error) {
    next(error);
  }
};

export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation,
};
