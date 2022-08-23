import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useStore } from 'react-redux';
import { useSocket } from '../../../contexts/SocketContext';
import * as userApi from '../../../api/user';
import * as chatApi from '../../../api/chat';
import * as messageApi from '../../../api/message';
import * as userActions from '../../../redux/user/actions';
import * as chatsActions from '../../../redux/chats/actions';
import * as messagesActions from '../../../redux/messages/actions';
import { RootState } from '../../../redux/rootReducer';

import { ThreeDots } from 'react-loader-spinner';
import LeftPanel from '../../templates/LeftPanel';
import RightPanel from '../../templates/RightPanel';
import './styles.scss';

type MainProps = {};

const Main = (props: MainProps): JSX.Element => {
  const navigate = useNavigate();
  const socket = useSocket();

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

  // Check the local storage and load the data from server
  React.useEffect(() => {
    if (!localStorage.getItem('userId') || !localStorage.getItem('token')) {
      navigate('/login');
    } else if (socket) {
      loadData().then(() => {
        socket.emit('loginUser', localStorage.getItem('userId'));
        setLoading(false);
      });
    }
  }, [socket]);

  // Socket listeners
  React.useEffect(() => {
    const sendMessageListener = (message: Message) => {
      if (
        store
          .getState()
          .chats.chats.findIndex((chat) => chat._id === message.chatId) > -1
      ) {
        dispatch(messagesActions.addMessage(message));
      }
    };
    const deleteMessageListener = (messageId: string) => {
      dispatch(messagesActions.deleteMessage(messageId));
    };
    const deleteMessagesOnChatListener = (chatId: string) => {
      if (
        store.getState().chats.chats.findIndex((chat) => chat._id === chatId) >
        -1
      ) {
        dispatch(messagesActions.deleteMessagesOnChat(chatId));
      }
    };
    const updateMessageResponse = (message: Message) => {
      if (
        store
          .getState()
          .chats.chats.findIndex((chat) => chat._id === message.chatId) > -1
      ) {
        dispatch(messagesActions.updateMessage(message._id, message));
      }
    };
    const createChatListener = (chat: Chat) => {
      if (
        chat.participants.findIndex(
          (participant) => participant === store.getState().user.user._id
        ) > -1
      ) {
        dispatch(chatsActions.addChat(chat));
      }
    };
    const deleteChatListener = (chatId: string) => {
      const chat = store
        .getState()
        .chats.chats.find((chat) => chat._id === chatId);
      if (chat) {
        if (
          chat.participants.findIndex(
            (participant) => participant === store.getState().user.user._id
          ) > -1
        ) {
          dispatch(chatsActions.deleteChat(chatId));
        }
      }
    };
    const updateChatListener = (chat: Chat) => {
      if (
        chat.participants.findIndex(
          (participant) => participant === store.getState().user.user._id
        ) > -1
      ) {
        dispatch(chatsActions.updateChat(chat._id, chat));
      }
    };
    const loginUserListener = (userId: string) => {
      const contact = store
        .getState()
        .user.contacts.find((contact) => contact._id === userId);
      if (contact) {
        dispatch(
          userActions.updateContact(userId, { ...contact, online: true })
        );
      }
    };
    const logoutUserListener = (userId: string) => {
      const contact = store
        .getState()
        .user.contacts.find((contact) => contact._id === userId);
      if (contact) {
        dispatch(
          userActions.updateContact(userId, { ...contact, online: false })
        );
      }
    };
    const updateUserListener = (user: User) => {
      console.log(user);
      dispatch(userActions.updateContact(user._id, user));
    };

    if (socket) {
      socket.on('sendMessageResponse', sendMessageListener);
      socket.on('deleteMessageResponse', deleteMessageListener);
      socket.on('deleteMessagesOnChatResponse', deleteMessagesOnChatListener);
      socket.on('updateMessageResponse', updateMessageResponse);
      socket.on('createChatResponse', createChatListener);
      socket.on('deleteChatResponse', deleteChatListener);
      socket.on('updateChatResponse', updateChatListener);
      socket.on('loginUserResponse', loginUserListener);
      socket.on('logoutUserResponse', logoutUserListener);
      socket.on('updateUserResponse', updateUserListener);

      return () => {
        socket.off('sendMessageResponse', sendMessageListener);
        socket.off('deleteMessageResponse', deleteMessageListener);
        socket.off(
          'deleteMessagesOnChatResponse',
          deleteMessagesOnChatListener
        );
        socket.off('updateMessageResponse', updateMessageResponse);
        socket.off('createChatResponse', createChatListener);
        socket.off('deleteChatResponse', deleteChatListener);
        socket.off('updateChatResponse', updateChatListener);
        socket.off('loginUserResponse', loginUserListener);
        socket.off('logoutUserResponse', logoutUserListener);
        socket.off('updateUserResponse', updateUserListener);
      };
    }
  }, [socket]);

  // Logout the user when close the tab
  React.useEffect(() => {
    function disconnect(event) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (userId && token) {
        userApi.logoutUser(userId).then(() => {
          socket.emit('logoutUser', userId);
          dispatch(userActions.logoutUser());
        });
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
    setChatSelected(null);
    setChatVisible(false);
  };

  const handleMouseOver = () => {
    if (chatSelected && chatVisible) {
      const user = store.getState().user.user;
      const messages = store
        .getState()
        .messages.messages.filter((msg) => msg.chatId === chatSelected._id);

      const getNumberMessagesNotRead = () =>
        messages.reduce((number, message) => {
          if (
            // Check if the user id is on the array
            message.read.findIndex((userId) => userId === user._id) !== -1 ||
            // You are the sender of the message
            message.senderId === user._id
          )
            return number;
          else return number + 1;
        }, 0);

      if (getNumberMessagesNotRead() > 0) {
        for (let i = messages.length - 1; i >= 0; i--) {
          let isRead =
            messages[i].read.findIndex((userId) => userId === user._id) > -1;
          let isOthers = messages[i].senderId !== user._id;
          if (isRead && isOthers) {
            break;
          } else {
            const newProps: Message = {
              ...messages[i],
              read: [...messages[i].read, user._id],
            };
            messageApi.updateMessage(messages[i]._id, newProps).then(() => {
              socket.emit('updateMessage', newProps);
              dispatch(
                messagesActions.updateMessage(messages[i]._id, newProps)
              );
            });
          }
        }
      }
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
    <div className="main" onMouseOver={handleMouseOver}>
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
