import React from 'react';
import { getDateLabel } from '../../../utils/date';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import * as messageApi from '../../../api/message';

import Avatar from '../../atoms/Avatar';
import IconWithMenu from '../IconWithMenu';
import { TbChevronDown } from 'react-icons/tb';
import './styles.scss';

type ChatItemProps = {
  _id: string;
  title: string;
  picture?: string;
  participants: string[];
  archived: boolean;
  onSelectChat?: (chat: Chat) => void;
  active?: boolean;
  menuItems: string[];
  onSelectMenuItems: (index: number, chatId: string) => void;
};

const ChatItem = ({
  _id,
  title,
  participants,
  picture,
  archived,
  active,
  menuItems,
  onSelectChat,
  onSelectMenuItems,
}: ChatItemProps): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>();
  const [hover, setHover] = React.useState(false);

  const user = useSelector<RootState, User>((state) => state.user.user);
  const contacts = useSelector<RootState, User[]>(
    (state) => state.user.contacts
  );
  const messages = useSelector<RootState, Message[]>((state) =>
    state.messages.messages.filter((msg) => msg.chatId === _id)
  );

  const [otherParticipant, setOtherParticipant] = React.useState<User>(null);
  const [lastMessage, setLastMessage] = React.useState<Message>(null);
  const [nbMessagesNotRead, setNbMessagesNotRead] =
    React.useState<number>(null);

  React.useEffect(() => {
    const otherParticipantId =
      user._id === participants[0] ? participants[1] : participants[0];

    setOtherParticipant(
      contacts.find((contact) => contact._id === otherParticipantId)
    );
  }, [participants, contacts, user]);

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
  }, []);

  const onClick = () => {
    onSelectChat({
      _id,
      title,
      participants,
      picture,
      archived,
    });
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
          messageApi.updateMessage(messages[i]._id, {
            ...messages[i],
          });
        }
      }
    }
  };

  if (!otherParticipant || !ref) {
    return (
      <div
        className={['chatItem', active && 'chatItem--active']
          .filter(Boolean)
          .join(' ')}
      ></div>
    );
  }

  return (
    <div
      ref={ref}
      className={['chatItem', active && 'chatItem--active']
        .filter(Boolean)
        .join(' ')}
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="chatItem__container" onClick={onClick}></div>
      <div className="chatItem__content--left">
        <Avatar
          iconClassName="chatItem__avatar"
          avatarUrl={
            participants.length > 2 /* Is it a group ? */
              ? picture
              : otherParticipant.profile.picture
          }
          large
        />
      </div>
      <div className="chatItem__content--right">
        <div className="chatItem__row">
          <span className="chatItem__title">{otherParticipant.username}</span>
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
              menuItems={menuItems}
              menuPlacement={'left-bottom'}
              onSelectMenuItem={(index) => onSelectMenuItems(index, _id)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
