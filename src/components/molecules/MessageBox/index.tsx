import React from 'react';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { useSocket } from '../../../contexts/SocketContext';
import * as messageApi from '../../../api/message';
import * as messagesActions from '../../../redux/messages/actions';

import { TbChevronDown } from 'react-icons/tb';
import { MdDone } from 'react-icons/md';
import IconWithMenu from '../IconWithMenu';
import './styles.scss';

type MessageBoxProps = {
  className?: string;
  message: Message;
  side: 'left-bottom' | 'right-bottom' | 'left-top' | 'right-top';
  mine?: boolean; // Is it your message ?
  read?: boolean;
};

const MessageBox = ({
  className,
  message,
  side,
  mine,
  read,
}: MessageBoxProps) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const [hover, setHover] = React.useState(false);

  const onSelectMenu = (index: number) => {
    switch (index) {
      case 0:
        return;
      case 1:
        return;
      case 2:
        return;
      case 3:
        return;
      case 4:
        messageApi.deleteMessage(message._id).then(() => {
          socket.emit('deleteMessage', message._id);
          dispatch(messagesActions.deleteMessage(message._id));
        });
        return;
    }
  };

  return (
    <div
      className={['messageBox', className].join(' ')}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="messageBox__container">
        <span className="messageBox__message">{message.content.text}</span>
        <IconWithMenu
          iconClassName={[
            'messageBox__chevron',
            !hover && 'messageBox__chevron--hide',
          ]
            .filter(Boolean)
            .join(' ')}
          Icon={TbChevronDown}
          menuItems={[
            'Répondre',
            'Réagir au message',
            'Transférer le message',
            'Marquer comme important',
            'Supprimer le message',
          ]}
          menuPlacement={
            side === 'left-bottom' ? 'right-bottom' : 'left-bottom'
          }
          onSelectMenuItem={onSelectMenu}
        />
        <div className="messageBox__footer">
          <span className="messageBox__date">
            {dayjs(message.createdAt).format('HH:mm')}
          </span>
          {read && mine ? (
            <MdDone className="messageBox__readStatus messageBox__readStatus--done" />
          ) : !read && mine ? (
            <MdDone className="messageBox__readStatus" />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
