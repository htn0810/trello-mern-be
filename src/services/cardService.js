/* eslint-disable no-useless-catch */
import { cardModel } from "~/models/cardModel";
import { columnModel } from "~/models/columnModel";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";

const createNewCard = async (reqBody) => {
  try {
    const newCard = { ...reqBody };
    const createdCard = await cardModel.createNew(newCard);

    const getNewCard = await cardModel.findOneById(createdCard.insertedId);
    if (getNewCard) {
      // update cardOrderIds at boards collection
      await columnModel.pushCardOrderIds(getNewCard);
    }
    return getNewCard;
  } catch (error) {
    throw error;
  }
};

const update = async (cardId, reqBody, cardCoverFile, userInfor) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now(),
    };

    let updatedCard = {};
    if (cardCoverFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        "card-covers"
      );
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url,
      });
    } else if (updateData.commentToAdd) {
      //Add comment to card
      const commentData = {
        ...updateData.commentToAdd,
        userId: userInfor._id,
        userEmail: userInfor.email,
        commentedAt: Date.now(),
      };
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData);
    } else if (updateData.inCommingUserInfo) {
      updatedCard = await cardModel.updateMembers(
        cardId,
        updateData.inCommingUserInfo
      );
    } else {
      updatedCard = await cardModel.update(cardId, updateData);
    }

    return updatedCard;
  } catch (error) {
    throw error;
  }
};

export const cardService = {
  createNewCard,
  update,
};
