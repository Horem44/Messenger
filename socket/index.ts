import { Socket } from "socket.io";

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

interface User {
  userId: string;
  socketId: string;
}

let users: User[] = [];

const addUser = (userId: string, socketId: string) => {
  const userIndex = users.findIndex((user) => user.userId === userId);

  if (userIndex !== -1) {
    users[userIndex] = { userId: users[userIndex].userId, socketId: socketId };
  } else {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  users.filter((user) => {
    return user.socketId !== socketId;
  });
};

const getUser = (userId: string) => {
  return users.find((user) => {
    return user.userId === userId;
  });
};

io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, id, tag, files }) => {
    console.log(id);
    const user = getUser(receiverId);

    if (user) {
      io.to(user!.socketId).emit("getMessage", {
        messageId: id,
        senderId,
        text,
        tag,
        files,
      });
    }
  });

  socket.on("updateMessage", ({ senderId, receiverId, text, id }) => {
    console.log(id);
    const user = getUser(receiverId);
    io.to(user!.socketId).emit("getUpdatedMessage", {
      messageId: id,
      senderId,
      text,
    });
  });

  socket.on("deleteMessage", ({ senderId, receiverId, id }) => {
    console.log(id);
    const user = getUser(receiverId);
    io.to(user!.socketId).emit("onDeleteMessage", {
      messageId: id,
      senderId,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
