import React from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { mongoObjectId } from '../../../utils/id';
import { useSocket } from '../../../contexts/SocketContext';
import * as messageApi from '../../../api/message';
import * as messagesActions from '../../../redux/messages/actions';

import ChatHeader from '../ChatHeader';
import ChatFooter from '../ChatFooter';
import MessageView from '../MessageView';
import './styles.scss';

type ChatViewProps = {
  className?: string;
  chat: Chat;
  onCloseChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onDisplayContactInfo?: () => void;
};

const ChatView = ({
  className,
  chat,
  onCloseChat,
  onDeleteChat,
  onDisplayContactInfo,
}: ChatViewProps): JSX.Element => {
  const socket = useSocket();
  const dispatch = useDispatch();

  const handleSendMessage = (messageContent: MessageContent) => {
    const message: Message = {
      _id: mongoObjectId(),
      chatId: chat._id,
      content: { ...messageContent },
      createdAt: dayjs().toDate(),
      senderId: localStorage.getItem('userId'),
      read: [localStorage.getItem('userId')],
      type:
        messageContent.text !== ''
          ? 'TEXT'
          : messageContent.pictureUrl !== ''
          ? 'IMAGE'
          : 'AUDIO',
    };

    messageApi.createMessage(message).then(() => {
      socket.emit('sendMessage', message);
      dispatch(messagesActions.addMessage(message));
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
      <MessageView chat={chat} />
      <ChatFooter
        className="chatView__footer"
        onSendClick={handleSendMessage}
      />
    </div>
  );
};

export default ChatView;
