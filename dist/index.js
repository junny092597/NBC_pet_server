"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors")); // cors import 추가
const app = (0, express_1.default)();
app.use((0, cors_1.default)()); // CORS 미들웨어 적용
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000", // 클라이언트 주소, 실제 주소로 변경 필요
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('chat message', (message) => {
        io.emit('chat message', message);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Listening on port ${port}`));
