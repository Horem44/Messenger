import { Socket } from "socket.io";

const io = require('socket.io')(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
});

interface User {
    userId: string;
    socketId: string;
}

let users:User[] = [];

const addUser = (userId:string, socketId:string) => {
    !users.some(user => user.userId === userId) &&
        users.push({userId, socketId});
};

const removeUser = (socketId: string) => {
    users.filter(user => {
        return user.socketId !== socketId;
    })
};

const getUser = (userId: string) => {
    return users.find(user => {
        return user.userId === userId;
    })
}

io.on("connection", (socket: Socket) => {
    console.log("a user connected");
    
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        console.log(socket.id);
        const user = getUser(receiverId);
        io.to(user!.socketId).emit("getMessage", {
            senderId,
            text,
        })
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})