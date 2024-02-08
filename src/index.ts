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

let onlineUsers: string[] = []; // 온라인 사용자 소켓 ID 목록을 저장할 배열, 타입을 string[]으로 명시

io.on('connection', (socket: Socket) => {
  console.log(`New client connected: ${socket.id}`);
  onlineUsers.push(socket.id); // 사용자(소켓 ID)를 온라인 목록에 추가
  io.emit('online users', onlineUsers); // 모든 클라이언트에게 온라인 사용자 목록을 방송

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    onlineUsers = onlineUsers.filter(user => user !== socket.id); // 사용자를 목록에서 제거
    io.emit('online users', onlineUsers); // 변경된 목록을 다시 방송
  });

  socket.on('chat message', (message: any) => {
    io.emit('chat message', message);
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
