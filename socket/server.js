const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Socket server is running');
});

const rooms = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('createRoom', (roomId) => {
    console.log("Room created")
    // const roomId = Math.random().toString(36).substring(2, 8);
    rooms.push({ id: roomId, players: [] });
    socket.join(roomId);
    socket.emit('roomCreated', roomId);
  });

  socket.on('joinRoom', (roomId, playerAddress ) => {
    console.log("Room joined by " + roomId + " with " + playerAddress)
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      room.players.push({ id: socket.id, playerAddress });
      socket.join(roomId);
      console.log(room)
      io.to(roomId).emit('playerJoined', room.players);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('initiateQuiz', (roomId) => {
    console.log('Initiating Quiz for ' + roomId);
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      io.to(roomId).emit('QuizInitialized');
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('connectedToRewardStream', (roomId, playerAddress) => {
    console.log('Player connecting to Reward Stream ' + roomId);
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      io.to(roomId).emit('rewardStreamConnectedByPlayer', playerAddress);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('startQuiz', (roomId) => {
    console.log('Starting quiz for ' + roomId);
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      io.to(roomId).emit('quizStarted');
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    rooms.forEach((room) => {
      room.players = room.players.filter((player) => player.id !== socket.id);
      io.to(room.id).emit('playerLeft', room.players);
    });
  });

  socket.on('showQuestion', (roomId, question ) => {
    console.log('Showing question for ' + roomId);
    console.log(question);
    io.to(roomId).emit('showQuestion', question);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
