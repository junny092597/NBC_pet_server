import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://nbc-pet.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

let onlineUsers: { id: string; nickname: string; }[] = [];

io.on('connection', (socket: Socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  socket.on('user nickname', (nickname) => {
    onlineUsers.push({ id: socket.id, nickname: nickname });
    io.emit('online users', onlineUsers.map(user => user.nickname)); // 닉네임 목록만 방송
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    onlineUsers = onlineUsers.filter(user => user.id !== socket.id); // 사용자를 목록에서 제거
    io.emit('online users', onlineUsers.map(user => user.nickname)); // 변경된 목록을 다시 방송
  });

  socket.on('chat message', (message: any) => {
    io.emit('chat message', message);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
