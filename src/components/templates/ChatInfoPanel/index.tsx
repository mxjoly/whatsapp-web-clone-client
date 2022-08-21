import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as chatApi from '../../../api/chat';
import * as chatsActions from '../../../redux/chats/actions';
import { RootState } from '../../../redux/rootReducer';
import { useSocket } from '../../../contexts/SocketContext';

import { IconType } from 'react-icons';
import {
  MdClose,
  MdStar,
  MdNotifications,
  MdChevronRight,
  MdLock,
  MdTimer,
  MdBlock,
  MdThumbDown,
  MdDelete,
} from 'react-icons/md';
import Avatar from '../../atoms/Avatar';
import './styles.scss';

type ChatInfoPanelProps = {
  className?: string;
  chat: Chat;
  onClose?: () => void;
  onDeleteChat?: (chatId: string) => void;
};

const ChatInfoPanel = ({
  className,
  chat,
  onClose,
  onDeleteChat,
}: ChatInfoPanelProps) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector<RootState, User>((state) => state.user.user);
  const contacts = useSelector<RootState, User[]>(
    (state) => state.user.contacts
  );

  const [otherParticipant, setOtherParticipant] = React.useState<User>(null);

  React.useEffect(() => {
    if (chat) {
      const otherParticipantId =
        chat.participants[0] === user._id
          ? chat.participants[1]
          : chat.participants[0];

      setOtherParticipant(
        contacts.find((contact) => contact._id === otherParticipantId)
      );
    }
  }, [chat, contacts, user]);

  const handleDeleteChat = () => {
    chatApi.deleteChat(chat._id).then(() => {
      socket.emit('deleteChat', chat._id);
      dispatch(chatsActions.deleteChat(chat._id));
      onDeleteChat(chat._id);
    });
  };

  if (!chat || !otherParticipant) {
    return (
      <div className={['chatInfoPanel__parameter', className].join(' ')}></div>
    );
  }

  const Parameter = ({
    className,
    LeftIcon,
    label,
    info,
    RightIcon,
    onClick,
    color,
    hoverEffect,
  }: {
    className?: string;
    LeftIcon?: IconType;
    label: string;
    info?: string;
    RightIcon?: IconType;
    onClick?: () => void;
    color?: string;
    hoverEffect?: boolean;
  }) => {
    const [hover, setHover] = React.useState(false);

    return (
      <div
        className={[
          'chatInfoPanel__parameter',
          className,
          hoverEffect && hover && 'chatInfoPanel__parameter--highlight',
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={onClick}
      >
        <div className="chatInfoPanel__parameter__row">
          {LeftIcon && (
            <LeftIcon
              className="chatInfoPanel__parameter__leftIcon"
              color={color}
            />
          )}
          <span className="chatInfoPanel__parameter__label" style={{ color }}>
            {label}
          </span>
          {RightIcon && (
            <RightIcon
              className="chatInfoPanel__parameter__rightIcon"
              color={color}
            />
          )}
        </div>
        {info && <span className="chatInfoPanel__parameter__info">{info}</span>}
      </div>
    );
  };

  return (
    <div className={['chatInfoPanel', className].join(' ')}>
      <div className="chatInfoPanel__header">
        <MdClose
          className="chatInfoPanel__header__iconClose"
          onClick={onClose}
        />
        <h3 className="chatInfoPanel__header__title">Infos du chat</h3>
      </div>
      <div className="chatInfoPanel__container">
        <div className="chatInfoPanel__section chatInfoPanel__section--alignCenter">
          <Avatar
            iconClassName="chatInfoPanel__avatar"
            avatarUrl={
              chat.participants.length > 2 // Is it a group ?
                ? chat.picture
                : otherParticipant.profile.picture
            }
          />
          <span className="chatInfoPanel__username">
            {otherParticipant.username}
          </span>
          <span className="chatInfoPanel__phone">
            {otherParticipant.profile.phone}
          </span>
        </div>
        <div className="chatInfoPanel__section chatInfoPanel__section--alignLeft">
          <span className="chatInfoPanel__section__title">Actus</span>
          <span className="chatInfoPanel__section__status">
            {otherParticipant.profile.status}
          </span>
        </div>
        <div className="chatInfoPanel__section chatInfoPanel__section--alignLeft">
          <span className="chatInfoPanel__section__title">
            Médias, liens, documents
          </span>
          <div className="chatInfoPanel__section__medias"></div>
        </div>
        <div className="chatInfoPanel__section chatInfoPanel__section--alignLeft">
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdStar}
            label="Messages importants"
            RightIcon={MdChevronRight}
            onClick={() => null}
          />
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdNotifications}
            label="Notifications en mode silencieux"
            RightIcon={MdChevronRight}
            onClick={() => null}
          />
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdTimer}
            label="Messages éphémères"
            info="Désactivés"
            RightIcon={MdChevronRight}
            onClick={() => null}
          />
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdLock}
            label="Chiffrement"
            info={'Les messages sont chiffrés de bout en bout.'}
            RightIcon={MdChevronRight}
            onClick={() => null}
          />
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdBlock}
            label={`Bloquer ${otherParticipant.username}`}
            onClick={() => null}
            color="#f15c6d"
            hoverEffect
          />
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdThumbDown}
            label={`Signaler ${otherParticipant.username}`}
            onClick={() => null}
            color="#f15c6d"
            hoverEffect
          />
          <Parameter
            className="chatInfoPanel__parameter"
            LeftIcon={MdDelete}
            label="Supprimer la discussion"
            onClick={handleDeleteChat}
            color="#f15c6d"
            hoverEffect
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInfoPanel;
