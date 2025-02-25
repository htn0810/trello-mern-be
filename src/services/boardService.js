/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
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

    const resBoard = cloneDeep(board);
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      );
    });

    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNewBoard,
  getDetailsBoard,
};
