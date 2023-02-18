import { Socket } from "socket.io";

// todo 8900 move to const
const io = require("socket.io")(8900, {
  cors: {
    // todo use consts
    origin: "http://localhost:3000",
  },
});

// todo move to models
interface User {
  userId: string;
  socketId: string;
}

// todo move this var to userService
let users: User[] = [];

const addUser = (userId: string, socketId: string) => {
  const userIndex = users.findIndex((user) => user.userId === userId);

  if (userIndex !== -1) {
    // todo use User type here and among file
    users[userIndex] = { userId: users[userIndex].userId, socketId: socketId };
  } else {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId: string) => {
  // todo avoid return if possible in file
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

  // todo use type string
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // todo use type
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

  // todo use types among whole file
  socket.on("deleteMessage", ({ senderId, receiverId, id }) => {
    console.log(id);

    const user = getUser(receiverId)!;

    io.to(user.socketId).emit("onDeleteMessage", {
      messageId: id,
      senderId,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
