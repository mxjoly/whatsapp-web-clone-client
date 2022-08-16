import React from 'react';
import dayjs from 'dayjs';
import { mongoObjectId } from '../../../utils/id';
import { createMessage } from '../../../api/message';

import ChatHeader from '../ChatHeader';
import ChatFooter from '../ChatFooter';
import MessageView from '../MessageView';
import './styles.scss';

type ChatViewProps = {
  className?: string;
  chat: Chat;
  messages: Message[];
  onCloseChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onDisplayContactInfo?: () => void;
};

const ChatView = ({
  className,
  chat,
  messages,
  onCloseChat,
  onDeleteChat,
  onDisplayContactInfo,
}: ChatViewProps): JSX.Element => {
  const sendMessage = (messageContent: MessageContent) => {
    createMessage({
      _id: mongoObjectId(),
      chatId: chat._id,
      content: {
        ...messageContent,
      },
      createdAt: dayjs().toDate(),
      senderId: localStorage.getItem('userId'),
      read: [],
      type:
        messageContent.text !== ''
          ? 'TEXT'
          : messageContent.pictureUrl !== ''
          ? 'IMAGE'
          : 'AUDIO',
    });
  };

  return (
    <div className={['chatView', className].join(' ')}>
      <ChatHeader
        className="chatView__header"
        chat={chat}
        onCloseChat={onCloseChat}
        onDeleteChat={onDeleteChat}
        onDisplayContactInfo={onDisplayContactInfo}
      />
      <MessageView messages={messages} />
      <ChatFooter className="chatView__footer" onSendClick={sendMessage} />
    </div>
  );
};

export default ChatView;
