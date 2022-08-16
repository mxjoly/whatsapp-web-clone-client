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

  // DOES NOT WORK
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
            setChats((chats) => chats.filter((chat) => chat._id !== chatId));
            console.log(`Chat ${chatId} deleted`);
          }
        })
        .catch(() => console.error(`Failed to delete the chat ${chatId}`));
    }
  };

  const handleChatArchive = (chatId: string, archived: boolean) => {
    const chat = chats.find((chat) => chat._id === chatId);
    if (chat) {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/chat/update/${chatId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          ...chat,
          archived,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setChats((chats) =>
              chats.map((c) => (chat._id === c._id ? { ...c, archived } : c))
            );
            console.log(`Chat ${chat._id} updated`);
          }
        })
        .catch(() => console.error(`Failed to update the chat ${chat._id}`));
    } else {
      console.error(
        `Chat ${chat._id} cannot be updated because he has been not found`
      );
    }
  };

  const handleCloseChat = (chatId: string) => {
    if (chatSelected._id === chatId && chatVisible) {
      setChatSelected(null);
      setChatVisible(false);
    }
  };

  if (!user) {
    return <div className="main"></div>;
  }

  return (
    <div className="main">
      <LeftPanel
        className="main__leftPanel"
        onSelectChat={handleChatSelection}
        onDeleteChat={handleChatDelete}
        onArchiveChat={(chatId) => handleChatArchive(chatId, true)}
        onUnarchiveChat={(chatId) => handleChatArchive(chatId, false)}
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
