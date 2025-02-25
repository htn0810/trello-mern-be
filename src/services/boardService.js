/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { boardModel } from "~/models/boardModel";
import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/formatters";

const createNewBoard = async (reqBody) => {
  try {
    const newBoard = { ...reqBody, slug: slugify(reqBody.title) };
    const createdBoard = await boardModel.createNew(newBoard);

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getDetailsBoard = async (boardId) => {
  try {
    const board = await boardModel.getDetailsBoard(boardId);
    if (!board) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Not found any board with id: ${boardId}`
      );
    }
    return board;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNewBoard,
  getDetailsBoard,
};
