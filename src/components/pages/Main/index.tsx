import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUser, logoutUser, updateUser } from '../../../api/user';
import { getChatsOfUser } from '../../../api/chat';
import { getMessagesOnChat } from '../../../api/message';

import { ThreeDots } from 'react-loader-spinner';
import LeftPanel from '../../templates/LeftPanel';
import RightPanel from '../../templates/RightPanel';
import './styles.scss';

type MainProps = {};

const Main = (props: MainProps): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const [user, setUser] = React.useState<User>(null);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [chatVisible, setChatVisible] = React.useState<boolean>(false);
  const [chatSelected, setChatSelected] = React.useState<Chat | null>(null);

  function loadData() {
    const userId = localStorage.getItem('userId');

    const loadUserData = new Promise<void>((resolve, reject) => {
      getUser(userId)
        .then((userData) => {
          if (userData) {
            setUser(userData);
            if (userData.online === false) {
              updateUser(userId, { ...userData, online: true }).then(() => {
                resolve();
              });
            } else {
              resolve();
            }
          }
        })
        .catch(() => {
          reject();
        });
    });

    const loadChatData = new Promise<void>((resolve, reject) => {
      getChatsOfUser(userId).then((chats) => {
        setChats(chats);
        let promises: Promise<Message[]>[] = [];

        chats.forEach((chat) => {
          promises.push(
            new Promise<Message[]>((resolve, reject) => {
              getMessagesOnChat(chat._id).then((messages) => resolve(messages));
            })
          );
        });

        Promise.all(promises)
          .then((messages) => {
            setMessages(messages.reduce((prev, cur) => prev.concat(cur), []));
            resolve();
          })
          .catch((err) => {
            console.error(err);
            reject();
          });
      });
    });

    return Promise.all([loadUserData, loadChatData])
      .then(() => {})
      .catch(() => {
        localStorage.clear();
        navigate('/login');
      });
  }

  React.useEffect(() => {
    if (!localStorage.getItem('userId') || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      loadData().then(() => {
        setLoading(false);
      });
    }
  }, [navigate]);

  // DOES NOT WORK
  React.useEffect(() => {
    function disconnect(event) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (userId && token) {
        logoutUser(userId);
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

  if (!user || loading) {
    return (
      <div className="main">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          ariaLabel="three-dots-loading"
          color="#00a884"
        />
      </div>
    );
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
