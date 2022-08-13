import React from 'react';
import axios from 'axios';
import { getDateLabel } from '../../../utils/date';

import Avatar from '../../atoms/Avatar';
import IconWithMenu from '../../molecules/IconWithMenu';
import { TbChevronDown } from 'react-icons/tb';
import './styles.scss';

type ChatItemProps = {
  _id: string;
  title: string;
  picture?: string;
  participants: string[];
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  active?: boolean;
  messages: Message[];
};

const ChatItem = ({
  _id,
  title,
  participants,
  picture,
  active,
  onSelectChat,
  onDeleteChat,
  messages,
}: ChatItemProps): JSX.Element => {
  const [hover, setHover] = React.useState(false);
  const [otherParticipant, setOtherParticipant] = React.useState<User>(null);
  const [lastMessage, setLastMessage] = React.useState<Message>(null);
  const [nbMessagesNotRead, setNbMessagesNotRead] =
    React.useState<number>(null);

  React.useEffect(() => {
    const otherParticipantId =
      localStorage.getItem('userId') === participants[0]
        ? participants[1]
        : participants[0];

    axios({
      method: 'get',
      url: `${axios.defaults.baseURL}/user/${otherParticipantId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setOtherParticipant(res.data.user);
        }
      })
      .catch(() =>
        console.error(`Failed to load the data of user ${otherParticipantId}`)
      );
  }, [participants]);

  React.useEffect(() => {
    const getNumberMessagesNotRead = () =>
      messages.reduce((number, message) => {
        const myId = localStorage.getItem('userId');
        if (
          // Check if the user id is on the array
          message.read.findIndex((userId) => userId === myId) !== -1 ||
          // You are the sender of the message
          message.senderId === myId
        )
          return number;
        else return number + 1;
      }, 0);

    setLastMessage(messages.slice(-1)[0]);
    setNbMessagesNotRead(getNumberMessagesNotRead());
  }, [messages]);

  const onClick = () => {
    onSelectChat(_id);
    if (nbMessagesNotRead > 0) {
      const myId = localStorage.getItem('userId');
      for (let i = messages.length - 1; i >= 0; i--) {
        let isRead =
          messages[i].read.findIndex((userId) => userId === myId) > -1;
        let isOthers = messages[i].senderId !== myId;
        if (isRead && isOthers) {
          break;
        } else {
          messages[i].read.push(myId);
          axios({
            method: 'post',
            url: `${axios.defaults.baseURL}/message/update/${messages[i]._id}`,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            data: {
              ...messages[i],
            },
          })
            .then(() => console.log(`Message ${messages[i]._id} updated`))
            .catch(() =>
              console.error(`Failed to update the message ${messages[i]._id}`)
            );
        }
      }
    }
  };

  const handleSelectMenuItem = (index: number) => {
    switch (index) {
      case 0:
        return;
      case 1:
        return;
      case 2:
        onDeleteChat(_id);
        return;
      case 3:
        return;
      case 4:
        return;
    }
  };

  if (!lastMessage) {
    return <div></div>;
  }

  return (
    <div
      className={['chatItem', active && 'chatItem--active']
        .filter(Boolean)
        .join(' ')}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-tip={lastMessage.content.text}
      data-delay-show="1000"
    >
      <div className="chatItem__container" onClick={onClick}></div>
      <div className="chatItem__content--left">
        <Avatar iconClassName="chatItem__avatar" avatarUrl={picture} large />
      </div>
      <div className="chatItem__content--right">
        <div className="chatItem__row">
          <span className="chatItem__title">{title}</span>
          <div
            className={[
              'chatItem__date',
              nbMessagesNotRead > 0 && 'chatItem__date--colored',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {lastMessage ? getDateLabel(lastMessage.createdAt, true) : ''}
          </div>
        </div>
        <div className="chatItem__row">
          <span className="chatItem__message">
            {lastMessage
              ? lastMessage.content.text
              : otherParticipant.profile.status}
          </span>
          {nbMessagesNotRead > 0 ? (
            <div className="chatItem__badge">{nbMessagesNotRead}</div>
          ) : (
            <IconWithMenu
              iconClassName={[
                'chatItem__chevron',
                !hover && 'chatItem__chevron--hidden',
              ]
                .filter(Boolean)
                .join(' ')}
              Icon={TbChevronDown}
              menuItems={[
                'Archiver la discussion',
                'Notification en mode silencieuses',
                'Supprimer la discussion',
                'Épingler la discussion',
                'Marquer comme non lu',
              ]}
              menuPlacement="right"
              onSelectMenuItem={handleSelectMenuItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
