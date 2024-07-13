import { createServer } from 'http';

import express from 'express';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer);

  // Socket.io implementation
  const players: { id: string, name: string }[] = [];

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinQuiz', (playerName: string) => {
      const player = { id: socket.id, name: playerName };
      players.push(player);
      io.emit('playerJoined', player);
    });

    socket.on('startQuiz', (quizId: string) => {
      io.emit('quizStarted', quizId);
    });

    socket.on('showQuestion', (question) => {
      io.emit('showQuestion', question);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      const index = players.findIndex((player) => player.id === socket.id);
      if (index !== -1) {
        players.splice(index, 1);
      }
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(3005, () => {
    console.log('> Ready on http://localhost:3005');
  });
});
