/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import { invitationModel } from "~/models/invitationModel";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from "~/utils/constants";
import { pickUser } from "~/utils/formatters";

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId);
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail);
    const board = await boardModel.findOneById(reqBody.boardId);

    if (!inviter || !invitee || !board) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Inviter, invitee or board not found"
      );
    }

    const inviteeObjectId = invitee._id;

    const isOwner = board?.ownerIds.some((id) => id.equals(inviteeObjectId));
    const isMember = board?.memberIds.some((id) => id.equals(inviteeObjectId));

    if (isOwner || isMember) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "User is already a member of this board"
      );
    }

    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING,
      },
    };

    const createdInvitation = await invitationModel.createNewBoardInvitation(
      newInvitationData
    );
    const getInvitation = await invitationModel.findOneById(
      createdInvitation.insertedId
    );

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee),
    };
    return resInvitation;
  } catch (error) {
    throw error;
  }
};

const getInvitations = async (userId) => {
  try {
    const getInvitations = await invitationModel.findByUserId(userId);
    const resInviations = getInvitations.map((inv) => {
      return {
        ...inv,
        invitee: inv.invitee[0] || {},
        inviter: inv.inviter[0] || {},
        board: inv.board[0] || {},
      };
    });
    return resInviations;
  } catch (error) {
    throw error;
  }
};

const updateBoardInvitation = async (userId, invitationId, status) => {
  try {
    const getInvitation = await invitationModel.findOneById(invitationId);
    if (!getInvitation) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Invitation not found");
    }

    const boardId = getInvitation.boardInvitation.boardId;
    const board = await boardModel.findOneById(boardId);
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");
    }

    const updateData = {
      boardInvitation: {
        ...getInvitation.boardInvitation,
        status: status,
      },
    };

    const updatedInvitation = await invitationModel.update(
      invitationId,
      updateData
    );

    // if user accept invitation, add user to memberIds of the board
    if (status === BOARD_INVITATION_STATUS.ACCEPTED) {
      await boardModel.pushMemberIds(userId, boardId);
    }

    return updatedInvitation;
  } catch (error) {
    throw error;
  }
};
export const inviationService = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation,
};
