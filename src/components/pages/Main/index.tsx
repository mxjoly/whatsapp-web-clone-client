import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux';
import * as userApi from '../../../api/user';
import * as chatApi from '../../../api/chat';
import * as messageApi from '../../../api/message';
import * as userActions from '../../../redux/user/actions';
import * as chatsActions from '../../../redux/chats/actions';
import * as messagesActions from '../../../redux/messages/actions';

import { ThreeDots } from 'react-loader-spinner';
import LeftPanel from '../../templates/LeftPanel';
import RightPanel from '../../templates/RightPanel';
import './styles.scss';
import { RootState } from '../../../redux/rootReducer';

type MainProps = {};

const Main = (props: MainProps): JSX.Element => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [chatVisible, setChatVisible] = React.useState<boolean>(false);
  const [chatSelected, setChatSelected] = React.useState<Chat | null>(null);

  // Redux
  const dispatch = useDispatch();
  const store = useStore<RootState>();

  function loadData() {
    const userId = localStorage.getItem('userId');

    const loadUserData = new Promise<void>((resolve, reject) => {
      userApi
        .getUser(userId)
        .then((userData) => {
          if (userData) {
            dispatch(userActions.saveUser(userData));
            if (userData.online === false) {
              const newProps: User = { ...userData, online: true };
              userApi.updateUser(userId, newProps).then(() => {
                dispatch(userActions.loginUser());
                resolve();
              });
            } else {
              resolve();
            }
          }
        })
        .catch(reject);
    });

    const loadUserContacts = new Promise<void>((resolve, reject) => {
      userApi
        .getUserContacts(userId)
        .then((users) => {
          dispatch(userActions.saveContacts(users));
          resolve();
        })
        .catch(reject);
    });

    const loadChatData = new Promise<void>((resolve, reject) => {
      chatApi.getChatsOfUser(userId).then((chats) => {
        dispatch(chatsActions.saveChats(chats));
        let promises: Promise<Message[]>[] = [];

        chats.forEach((chat) => {
          promises.push(
            new Promise<Message[]>((resolve, reject) => {
              messageApi
                .getMessagesOnChat(chat._id)
                .then((messages) => resolve(messages));
            })
          );
        });

        Promise.all(promises)
          .then((messages) => {
            dispatch(
              messagesActions.saveMessages(
                messages.reduce((prev, cur) => prev.concat(cur), [])
              )
            );
            resolve();
          })
          .catch((err) => {
            console.error(err);
            reject();
          });
      });
    });

    return Promise.all([loadUserData, loadUserContacts, loadChatData])
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
        userApi.logoutUser(userId);
      }
    }
    window.addEventListener('beforeunload', disconnect);
    return () => window.removeEventListener('beforeunload', disconnect);
  }, []);

  const handleChatSelection = (chatSelected: Chat) => {
    const chats = store.getState().chats.chats;
    if (chatSelected) {
      let exists = chats.find((chat) => chat._id === chatSelected._id);
      if (exists) {
        setChatVisible(true);
        setChatSelected(chats.find((chat) => chat._id === chatSelected._id));
      } else {
        dispatch(chatsActions.addChat(chatSelected));
        setChatVisible(true);
        setChatSelected(chatSelected);
      }
    }
  };

  const handleCloseChat = (chatId: string) => {
    if (chatSelected._id === chatId && chatVisible) {
      setChatSelected(null);
      setChatVisible(false);
    }
  };

  if (loading) {
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
        chatSelected={chatSelected}
      />
      <RightPanel
        className="main__rightPanel"
        displayChat={chatVisible}
        chatSelected={chatSelected}
        onCloseChat={handleCloseChat}
        onDeleteChat={handleCloseChat}
      />
    </div>
  );
};

export default Main;
