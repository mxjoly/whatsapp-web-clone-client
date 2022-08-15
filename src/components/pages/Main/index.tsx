import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import LeftPanel from '../../templates/LeftPanel';
import RightPanel from '../../templates/RightPanel';
import './styles.scss';

type MainProps = {};

const Main = (props: MainProps): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User>(null);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [chatVisible, setChatVisible] = React.useState<boolean>(false);
  const [chatSelected, setChatSelected] = React.useState<Chat | null>(null);

  function loadData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    axios({
      method: 'get',
      url: `${axios.defaults.baseURL}/user/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user);
          if (res.data.user.online === false) {
            axios({
              method: 'post',
              url: `${axios.defaults.baseURL}/user/update/${userId}`,
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: {
                ...res.data.user,
                online: true,
              },
            })
              .then(() => console.log('Reconnected successfully'))
              .catch(() => console.error(`Failed to reconnect`));
          }
        }
      })
      .catch(() => {
        console.error(`Failed to load the user data`);
        localStorage.clear();
        navigate('/login');
      });

    axios({
      method: 'get',
      url: `${axios.defaults.baseURL}/chat/user/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          const chats = res.data.chats as Chat[];
          setChats(res.data.chats);

          let promises: Promise<Message[]>[] = [];

          chats.forEach((chat) => {
            promises.push(
              new Promise<Message[]>((resolve, reject) => {
                axios({
                  method: 'get',
                  url: `${axios.defaults.baseURL}/message/chat/${chat._id}`,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then((res) => {
                    if (res.status === 200) {
                      resolve(res.data.messages);
                    }
                  })
                  .catch(reject);
              })
            );
          });

          Promise.all(promises)
            .then((messages) => {
              setMessages(messages.reduce((prev, cur) => prev.concat(cur), []));
            })
            .catch((err) => console.error(err));
        }
      })
      .catch(() => console.error(`Error trying to load the user chats`));
  }

  React.useEffect(() => {
    if (!localStorage.getItem('userId') || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      loadData();
    }
  }, [navigate]);

  React.useEffect(() => {
    function disconnect(event) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (userId && token) {
        axios({
          method: 'post',
          url: `${axios.defaults.baseURL}/user/update/${userId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            ...user,
            online: false,
          },
        })
          .then(() => console.log('Disconnected successfully'))
          .catch(() => console.error(`Failed to disconnect`));
      }
    }
    window.addEventListener('beforeunload', disconnect);
    return () => window.removeEventListener('beforeunload', disconnect);
  }, [user]);

  const handleChatSelection = (chatId: string) => {
    if (chatId) {
      setChatVisible(true);
      setChatSelected(chats.find((chat) => chat._id === chatId));
    }
  };

  const handleChatDelete = (chatId: string) => {
    if (chatSelected._id === chatId && chatVisible) {
      axios({
        method: 'delete',
        url: `${axios.defaults.baseURL}/chat/delete/${chatId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Chat ${chatId} deleted`);
          }
        })
        .catch(() => console.error(`Failed to delete the chat ${chatId}`));
    }
  };

  const handleCloseChat = (chatId: string) => {
    if (chatSelected._id === chatId && chatVisible) {
      setChatSelected(null);
      setChatVisible(false);
    }
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="main">
      <LeftPanel
        className="main__leftPanel"
        onSelectChat={handleChatSelection}
        onDeleteChat={handleChatDelete}
        chatSelected={chatSelected}
        chats={chats}
        user={user}
        messages={messages}
      />
      <RightPanel
        className="main__rightPanel"
        displayChat={chatVisible}
        chatSelected={chatSelected}
        onDeleteChat={handleChatDelete}
        onCloseChat={handleCloseChat}
        messages={messages}
      />
    </div>
  );
};

export default Main;
