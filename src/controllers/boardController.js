import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/boardService";

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const createdBoard = await boardService.createNewBoard(userId, req.body);
    res.status(StatusCodes.OK).json(createdBoard);
  } catch (error) {
    next(error);
  }
};

const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const { page, itemsPerPage, q } = req.query;
    const queryFilters = q;
    const result = await boardService.getBoards(
      userId,
      page,
      itemsPerPage,
      queryFilters
    );
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getDetailsBoard = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const boardId = req.params.id;
    const detailsBoard = await boardService.getDetailsBoard(userId, boardId);
    res.status(StatusCodes.OK).json(detailsBoard);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updatedBoard = await boardService.update(boardId, req.body);
    res.status(StatusCodes.OK).json(updatedBoard);
  } catch (error) {
    next(error);
  }
};

const moveCardToDifferentColumns = async (req, res, next) => {
  try {
    const result = await boardService.moveCardToDifferentColumns(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const boardController = {
  createNew,
  getDetailsBoard,
  update,
  moveCardToDifferentColumns,
  getBoards,
};
