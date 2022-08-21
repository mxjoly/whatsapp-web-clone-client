import React, { useContext } from 'react';
import socketIO, { Socket } from 'socket.io-client';

const SOCKET_URL =
  process.env.NODE_ENV === 'development'
    ? `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}`
    : `https://${process.env.REACT_APP_SERVER_URL}`;

const socketClient = socketIO(SOCKET_URL);

export const SocketContext = React.createContext(socketClient);

export const SocketProvider = (props) => {
  const [socket, setSocket] = React.useState<Socket>(null);

  React.useEffect(() => {
    setSocket(socketClient);
    return () => socketClient.close() as any;
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
