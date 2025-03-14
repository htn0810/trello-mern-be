/* eslint-disable no-console */
import exitHook from "async-exit-hook";
import express from "express";
import cors from "cors";
import { env } from "~/config/environment";
import { CLOSE_DB, CONNECT_DB } from "~/config/mongodb";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import { APIs_V1 } from "~/routes/v1";
import cookieParser from "cookie-parser";
import { corsOptions } from "~/config/cors";

import socketIo from "socket.io";
import http from "http";
import { inviteUserToBoardSocket } from "~/sockets/inviteUserToBoardSocket";

const START_SERVER = () => {
  const app = express();

  // app.use((req, res, next) => {
  //   res.set("Cache-Control", "no-store");
  //   next();
  // });

  app.use(cookieParser());

  app.use(cors(corsOptions));
  // Enable req.body json data
  app.use(express.json());
  app.use("/v1", APIs_V1);

  app.use(errorHandlingMiddleware);

  // init a server to handle socket io
  const server = http.createServer(app);
  // init io with server and corsOptions
  const io = socketIo(server, { cors: corsOptions });

  // handle socket connection
  io.on("connection", (socket) => {
    // listen event FE_USER_INVITED_TO_BOARD from client
    inviteUserToBoardSocket(socket);
  });

  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is running at ${env.APP_HOST}:${env.APP_PORT}/`);
  });

  exitHook(() => {
    CLOSE_DB();
  });
};

CONNECT_DB()
  .then(() => console.log("Connected to MongoDB Cloud Atlas!"))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
