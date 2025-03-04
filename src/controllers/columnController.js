import { StatusCodes } from "http-status-codes";
import { columnService } from "~/services/columnService";

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNewcolumn(req.body);
    res.status(StatusCodes.OK).json(createdColumn);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id;
    const updatedColumn = await columnService.update(columnId, req.body);
    res.status(StatusCodes.OK).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};

const deleteColumnById = async (req, res, next) => {
  try {
    const columnId = req.params.columnId;
    const boardId = req.params.boardId;
    const deletedColumn = await columnService.deleteColumnById(
      boardId,
      columnId
    );
    res.status(StatusCodes.OK).json(deletedColumn);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNew,
  update,
  deleteColumnById,
};
