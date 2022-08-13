import React from 'react';
import axios from 'axios';

import LeftPanel from '../../templates/LeftPanel';
import RightPanel from '../../templates/RightPanel';
import './styles.scss';

type MainProps = {};

const Main = (props: MainProps): JSX.Element => {
  const [user, setUser] = React.useState<User>(null);
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [chatVisible, setChatVisible] = React.useState<boolean>(false);
  const [chatSelected, setChatSelected] = React.useState<Chat | null>(null);

  // Programmatically login when we drop the login page
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');

    axios({
      method: 'get',
      url: `${axios.defaults.baseURL}/user/${userId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data.user);
        }
      })
      .catch(() => console.error(`Failed to load the user data`));

    axios({
      method: 'get',
      url: `${axios.defaults.baseURL}/chat/user/${userId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
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

          Promise.all(promises).then((messages) => {
            setMessages(messages.reduce(
              (prev, cur) => prev.concat(cur),
              []
            ));
          });
        }
      })
      .catch(() => console.error(`Error trying to load the user chats`));
  }, []);

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
