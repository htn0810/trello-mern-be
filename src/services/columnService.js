/* eslint-disable no-useless-catch */
import { boardModel } from "~/models/boardModel";
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";

const createNewcolumn = async (reqBody) => {
  try {
    const newColumn = { ...reqBody };
    const createdColumn = await columnModel.createNew(newColumn);

    const getNewColumn = await columnModel.findOneById(
      createdColumn.insertedId
    );

    if (getNewColumn) {
      getNewColumn.cards = [];

      // update columnOrderIds at boards collection
      await boardModel.pushColumnOrderIds(getNewColumn);
    }
    return getNewColumn;
  } catch (error) {
    throw error;
  }
};

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };

    const updatedColumn = await columnModel.update(columnId, updateData);
    return updatedColumn;
  } catch (error) {
    throw error;
  }
};

const deleteColumnById = async (boardId, columnId) => {
  try {
    const deletedColumn = await columnModel.deleteColumnById(columnId);
    await boardModel.removeColumnIdInColumnOrderIds(boardId, columnId);
    await cardModel.removeCardsByColumnId(columnId);
    return deletedColumn;
  } catch (error) {
    throw error;
  }
};

export const columnService = {
  createNewcolumn,
  update,
  deleteColumnById,
};
