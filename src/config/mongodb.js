import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "~/config/environment";

let trelloDBInstance = null;

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect();
  trelloDBInstance = mongoClientInstance.db(env.DB_NAME);
};

export const GET_DB = () => {
  if (!trelloDBInstance) throw new Error("Must connect to Dataase first!");
  return trelloDBInstance;
};

export const CLOSE_DB = async () => {
  await mongoClientInstance.close();
};
