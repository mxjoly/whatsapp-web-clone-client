import React from 'react';
import dayjs from 'dayjs';

import ChatItem from '../ChatItem';
import './styles.scss';

type ChatListProps = {
  chats: Chat[];
  messages: Message[];
  chatMenuItems: string[];
  onSelectChatMenuItems: (index: number, chatId: string) => void;
  onSelectChat?: (chatId: string) => void;
  chatSelected?: Chat | null;
};

const ChatList = ({
  chats,
  messages,
  chatSelected,
  onSelectChat,
  chatMenuItems,
  onSelectChatMenuItems,
}: ChatListProps): JSX.Element => {
  function findLastMessageChat(chat: Chat) {
    const chatMessages = messages.filter((msg) => msg.chatId === chat._id);
    return chatMessages
      .sort(
        (msg1, msg2) =>
          dayjs(msg1.createdAt).valueOf() - dayjs(msg2.createdAt).valueOf()
      )
      .slice(-1)[0];
  }

  return (
    <div className="chatList">
      {chats
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
            messages={messages.filter((msg) => msg.chatId === chat._id)}
          />
        ))}
    </div>
  );
};

export default ChatList;
