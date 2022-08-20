import React from 'react';
import dayjs from 'dayjs';
import { deleteMessage } from '../../../api/message';

import { TbChevronDown } from 'react-icons/tb';
import { MdDone } from 'react-icons/md';
import IconWithMenu from '../IconWithMenu';
import './styles.scss';

type MessageBoxProps = {
  className?: string;
  message: Message;
  side: 'left-bottom' | 'right-bottom' | 'left-top' | 'right-top';
  mine?: boolean; // Is it your message ?
};

const MessageBox = ({ className, message, side, mine }: MessageBoxProps) => {
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
        deleteMessage(message._id);
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
          {/* {message.read.length > 0 && mine && (
            <MdDone className="messageBox__done" />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
