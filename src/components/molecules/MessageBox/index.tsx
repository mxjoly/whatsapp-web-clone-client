import React from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import IconWithMenu from '../IconWithMenu';
import { TbChevronDown } from 'react-icons/tb';
import { MdDone } from 'react-icons/md';
import './styles.scss';

type MessageBoxProps = {
  className?: string;
  message: Message;
  side: 'left' | 'right';
  mine?: boolean; // Is it your message ?
};

const MessageBox = ({ className, message, side }: MessageBoxProps) => {
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
        axios({
          method: 'delete',
          url: `${axios.defaults.baseURL}/message/delete/${message._id}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then(() => console.log(`Message ${message._id} deleted`))
          .catch(() =>
            console.error(`Failed to delete the message ${message._id}`)
          );
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
          menuPlacement={side === 'left' ? 'right' : 'left'}
          onSelectMenuItem={onSelectMenu}
        />
        <div className="messageBox__footer">
          <span className="messageBox__date">
            {dayjs(message.createdAt).format('HH:mm')}
          </span>
          {message.read.length > 0 &&
            message.senderId === localStorage.getItem('userId') && (
              <MdDone className="messageBox__done" />
            )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
