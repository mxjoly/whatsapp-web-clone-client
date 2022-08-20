import React from 'react';
import dayjs from 'dayjs';
import { useStore } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';

import ChatItem from '../../molecules/ChatItem';
import './styles.scss';

type ChatListProps = {
  chats: Chat[];
  chatMenuItems: string[];
  onSelectChatMenuItems: (index: number, chatId: string) => void;
  onSelectChat?: (chat: Chat) => void;
  chatSelected?: Chat | null;
};

const ChatList = ({
  chats,
  chatSelected,
  onSelectChat,
  chatMenuItems,
  onSelectChatMenuItems,
}: ChatListProps): JSX.Element => {
  const store = useStore<RootState>();

  function findLastMessageChat(chat: Chat) {
    const chatMessages = store
      .getState()
      .messages.messages.filter((msg) => msg.chatId === chat._id);
    return chatMessages
      .sort(
        (msg1, msg2) =>
          dayjs(msg1.createdAt).valueOf() - dayjs(msg2.createdAt).valueOf()
      )
      .slice(-1)[0];
  }

  return (
    <div className="chatList">
      {[...chats]
        .sort((chat1, chat2) => {
          let lastMessageChat1 = findLastMessageChat(chat1);
          let lastMessageChat2 = findLastMessageChat(chat2);
          if (lastMessageChat1 && lastMessageChat2) {
            return (
              dayjs(lastMessageChat2.createdAt).valueOf() -
              dayjs(lastMessageChat1.createdAt).valueOf()
            );
          } else {
            return 0;
          }
        })
        .map((chat) => (
          <ChatItem
            key={chat._id}
            {...chat}
            onSelectChat={onSelectChat}
            onSelectMenuItems={onSelectChatMenuItems}
            menuItems={chatMenuItems}
            active={chatSelected !== null && chat._id === chatSelected._id}
          />
        ))}
    </div>
  );
};

export default ChatList;
