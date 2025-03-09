export const inviteUserToBoardSocket = (socket) => {
  socket.on("FE_USER_INVITED_TO_BOARD", (invitation) => {
    console.log("FE_USER_INVITED_TO_BOARD", invitation);
    // broadcast event to all clients except the sender
    socket.broadcast.emit("BE_USER_INVITED_TO_BOARD", invitation);
  });
};
