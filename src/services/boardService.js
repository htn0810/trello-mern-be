/* eslint-disable no-useless-catch */
import { StatusCodes } from "http-status-codes";
import { cloneDeep } from "lodash";
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import ApiError from "~/utils/ApiError";
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from "~/utils/constants";
import { slugify } from "~/utils/formatters";

const createNewBoard = async (userId, reqBody) => {
  try {
    const newBoard = { ...reqBody, slug: slugify(reqBody.title) };
    const createdBoard = await boardModel.createNew(userId, newBoard);

    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId);
    return getNewBoard;
  } catch (error) {
    throw error;
  }
};

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    if (!page) page = DEFAULT_PAGE;
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
    const results = await boardModel.getBoards(
      userId,
      parseInt(page, 10),
      parseInt(itemsPerPage, 10)
    );
    return results;
  } catch (error) {
    throw error;
  }
};

const getDetailsBoard = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetailsBoard(userId, boardId);
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

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };

    const updatedBoard = await boardModel.update(boardId, updateData);
    return updatedBoard;
  } catch (error) {
    throw error;
  }
};

const moveCardToDifferentColumns = async (reqBody) => {
  try {
    const {
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds,
    } = reqBody;

    await columnModel.update(prevColumnId, {
      cardOrderIds: prevCardOrderIds,
      updatedAt: Date.now(),
    });

    await columnModel.update(nextColumnId, {
      cardOrderIds: nextCardOrderIds,
      updatedAt: Date.now(),
    });

    await cardModel.update(currentCardId, { columnId: nextColumnId });
    return {
      updateResult: "Successfully!",
    };
  } catch (error) {
    throw error;
  }
};

export const boardService = {
  createNewBoard,
  getDetailsBoard,
  update,
  moveCardToDifferentColumns,
  getBoards,
};
