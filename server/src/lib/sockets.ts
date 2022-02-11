import { WebSocket } from 'ws';

const SocketList: WebSocket[] = [];

const Sockets = {
  Register: (socket: WebSocket) => {
    socket.on('close', (code: number, reason: Buffer) => {
      Sockets.Unregister(socket);
    });

    SocketList.push(socket);
  },
  Unregister: (socket: WebSocket) => {
    const idx = SocketList.findIndex((v) => v === socket);
    if (idx > -1) {
      SocketList.splice(idx, 1);
    }
  },
  Broadcast: (type: string, data: any) => {
    for (const socket of SocketList) {
      socket.send(JSON.stringify({ type, data }));
    }
  },
};

export default Sockets;
