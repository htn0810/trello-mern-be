import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";
import { CARD_MEMBER_ACTIONS } from "~/utils/constants";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE,
} from "~/utils/validators";

// Define Collection (name & schema)
const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),

  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),

  cover: Joi.string().default(null),
  memberIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  comments: Joi.array()
    .items({
      userId: Joi.string()
        .pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE),
      userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
      userAvatar: Joi.string(),
      userDisplayName: Joi.string(),
      content: Joi.string(),
      commentedAt: Joi.date().timestamp(),
    })
    .default([]),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ["_id", "boardId", "createdAt"];

const validateBeforeCreate = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data);
    const createdCard = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne({
        ...validData,
        boardId: new ObjectId(String(validData.boardId)),
        columnId: new ObjectId(String(validData.columnId)),
      });
    return createdCard;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(String(id)),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (cardId, updateData) => {
  try {
    // filter data (exclude field which we don't want update)
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName];
      }
    });

    if (updateData.columnId) {
      updateData.columnId = new ObjectId(String(updateData.columnId));
    }

    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(cardId)) },
        { $set: updateData },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const removeCardsByColumnId = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(String(columnId)) });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const unshiftNewComment = async (cardId, commentData) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(cardId)) },
        { $push: { comments: { $each: [commentData], $position: 0 } } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateMembers = async (cardId, inCommingUserInfo) => {
  try {
    let updateCondition = {};
    if (inCommingUserInfo.action === CARD_MEMBER_ACTIONS.ADD) {
      updateCondition = {
        $push: { memberIds: new ObjectId(String(inCommingUserInfo.userId)) },
      };
    } else {
      updateCondition = {
        $pull: { memberIds: new ObjectId(String(inCommingUserInfo.userId)) },
      };
    }
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(String(cardId)) },
        updateCondition,
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  removeCardsByColumnId,
  unshiftNewComment,
  updateMembers,
};
