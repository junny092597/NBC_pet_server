import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors'; // cors import 추가

const app = express();
app.use(cors()); // CORS 미들웨어 적용

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://nbc-pet.vercel.app/", // 클라이언트 주소, 실제 주소로 변경 필요
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.on('connection', (socket: Socket) => {
  console.log('New client connected');

  socket.on('chat message', (message: any) => {
    io.emit('chat message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
