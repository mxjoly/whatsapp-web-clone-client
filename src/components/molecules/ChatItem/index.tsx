import React from 'react';
import { getDateLabel } from '../../../utils/date';
import { useSelector, useDispatch } from 'react-redux';
import { useSocket } from '../../../contexts/SocketContext';
import { RootState } from '../../../redux/rootReducer';
import * as messageApi from '../../../api/message';
import * as messagesAction from '../../../redux/messages/actions';

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

  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector<RootState, User>((state) => state.user.user);
  const contacts = useSelector<RootState, User[]>(
    (state) => state.user.contacts
  );
  const messages = useSelector<RootState, Message[]>((state) =>
    state.messages.messages.filter((msg) => msg.chatId === _id)
  );

  const [otherParticipant, setOtherParticipant] = React.useState<User>(null);

  React.useEffect(() => {
    const otherParticipantId =
      user._id === participants[0] ? participants[1] : participants[0];

    setOtherParticipant(
      contacts.find((contact) => contact._id === otherParticipantId)
    );
  }, [participants, contacts, user]);

  const getNumberMessagesNotRead = () =>
    messages.reduce((number, message) => {
      if (
        // Check if the user id is on the array
        message.read.findIndex((userId) => userId === user._id) !== -1 ||
        // You are the sender of the message
        message.senderId === user._id
      )
        return number;
      else return number + 1;
    }, 0);

  const lastMessage = messages.slice(-1)[0];
  const nbMessageNotRead = getNumberMessagesNotRead();

  const onClick = () => {
    onSelectChat({
      _id,
      title,
      participants,
      picture,
      archived,
    });
    if (nbMessageNotRead > 0) {
      for (let i = messages.length - 1; i >= 0; i--) {
        let isRead =
          messages[i].read.findIndex((userId) => userId === user._id) > -1;
        let isOthers = messages[i].senderId !== user._id;
        if (isRead && isOthers) {
          break;
        } else {
          const newProps: Message = {
            ...messages[i],
            read: [...messages[i].read, user._id],
          };
          messageApi.updateMessage(messages[i]._id, newProps).then(() => {
            socket.emit('updateMessage', newProps);
            dispatch(messagesAction.updateMessage(messages[i]._id, newProps));
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
              nbMessageNotRead > 0 && 'chatItem__date--colored',
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
          {nbMessageNotRead > 0 ? (
            <div className="chatItem__badge">{nbMessageNotRead}</div>
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
