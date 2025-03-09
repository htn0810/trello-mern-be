import { StatusCodes } from "http-status-codes";
import { cardService } from "~/services/cardService";

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNewCard(req.body);
    res.status(StatusCodes.OK).json(createdCard);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const cardCoverFile = req.file;
    const userInfor = req.jwtDecoded;
    const updatedCard = await cardService.update(
      cardId,
      req.body,
      cardCoverFile,
      userInfor
    );
    res.status(StatusCodes.OK).json(updatedCard);
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
  update,
};
