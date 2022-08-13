import React from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { mongoObjectId } from '../../../utils/id';

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
    axios({
      method: 'post',
      url: `${axios.defaults.baseURL}/message/insert`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: {
        _id: mongoObjectId(),
        chatId: chat._id,
        content: {
          ...messageContent,
        },
        createdAt: dayjs().toDate(),
        senderId: localStorage.getItem('userId'),
        read: [],
        type: 'TEXT',
      },
    })
      .then(() => console.log(`Message sent`))
      .catch(() => console.error(`Failed to send the message`));
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
