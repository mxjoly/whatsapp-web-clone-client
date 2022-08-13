import React from 'react';

let socketClient: any = null;

const socketIOClient = require('socket.io-client');
socketClient = socketIOClient(
  process.env.NODE_ENV === 'development'
    ? `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/api`
    : `https://${process.env.REACT_APP_SERVER_URL}/api`
);
socketClient.on('connection', () => {
  console.log('Connected to the server');
});

const SocketContext = React.createContext(socketClient);

export const SocketProvider = (props: any) => {
  return (
    <SocketContext.Provider value={socketClient}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return socketClient;
};
