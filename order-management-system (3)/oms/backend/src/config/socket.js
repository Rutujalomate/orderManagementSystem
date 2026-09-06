const { Server } = require("socket.io");

let io;

function initSocket(server, clientOrigin) {
  io = new Server(server, {
    cors: { origin: clientOrigin },
  });

  io.on("connection", (socket) => {
    console.log("client connected", socket.id);

    socket.on("subscribe:store", (storeId) => {
      if (!storeId) return;
      socket.join("store:" + storeId);
    });

    socket.on("unsubscribe:store", (storeId) => {
      if (!storeId) return;
      socket.leave("store:" + storeId);
    });

    socket.on("disconnect", () => {
      console.log("client disconnected", socket.id);
    });
  });

  return io;
}

function emitToStore(storeId, event, payload) {
  if (!io) return;
  io.to("store:" + storeId).emit(event, payload);
  io.to("store:all").emit(event, payload);
}

module.exports = { initSocket, emitToStore };
