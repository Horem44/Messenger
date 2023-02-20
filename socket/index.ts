import { Socket } from "socket.io";
import { PORT, origin } from "./constants/constants";
import { DeleteMessageDto, SendMessageDto, UpdateMessageDto } from "./dtos";
import { UserService } from "./services/user.service";

const userService = new UserService();

const io = require("socket.io")(PORT, {
  cors: {
    origin: origin,
  },
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  socket.on("addUser", (userId: string) => {
    userService.addUser(userId, socket.id);
    io.emit("getUsers", userService.getUsers());
  });

  socket.on("sendMessage", (sendMessageDto: SendMessageDto) => {
    const user = userService.getUser(sendMessageDto.receiverId);

    if (user) {
      io.to(user!.socketId).emit("getMessage", {
        messageId: sendMessageDto.id,
        senderId: sendMessageDto.senderId,
        text: sendMessageDto.text,
        tag: sendMessageDto.tag,
        files: sendMessageDto.files,
      });
    }
  });

  socket.on("updateMessage", (updateMessageDto: UpdateMessageDto) => {
    const user = userService.getUser(updateMessageDto.receiverId);

    io.to(user!.socketId).emit("getUpdatedMessage", {
      messageId: updateMessageDto.id,
      senderId: updateMessageDto.senderId,
      text: updateMessageDto.text,
    });
  });

  socket.on("deleteMessage", (deleteMessageDto: DeleteMessageDto) => {
    const user = userService.getUser(deleteMessageDto.receiverId)!;

    io.to(user.socketId).emit("onDeleteMessage", {
      messageId: deleteMessageDto.id,
      senderId: deleteMessageDto.senderId,
    });
  });

  socket.on("disconnect", () => {
    userService.removeUser(socket.id);
    io.emit("getUsers", userService.getUsers());
  });
});
