import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../contexts/SocketContext';
import * as chatApi from '../../../api/chat';
import * as messageApi from '../../../api/message';
import * as chatsActions from '../../../redux/chats/actions';
import * as messagesActions from '../../../redux/messages/actions';
import { RootState } from '../../../redux/rootReducer';

import Avatar from '../../atoms/Avatar';
import { MdMoreVert, MdOutlineSearch } from 'react-icons/md';
import IconWithMenu from '../../molecules/IconWithMenu';
import './styles.scss';

type ChatHeaderProps = {
  className?: string;
  chat: Chat;
  onCloseChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onDisplayContactInfo?: () => void;
};

const ChatHeader = ({
  chat,
  className,
  onCloseChat,
  onDeleteChat,
  onDisplayContactInfo,
}: ChatHeaderProps) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector<RootState, User>((state) => state.user.user);
  const contacts = useSelector<RootState, User[]>(
    (state) => state.user.contacts
  );

  const [otherParticipant, setOtherParticipant] = React.useState<User>(null);

  React.useEffect(() => {
    const otherParticipantId =
      chat.participants[0] === user._id
        ? chat.participants[1]
        : chat.participants[0];

    setOtherParticipant(
      contacts.find((contact) => contact._id === otherParticipantId)
    );
  }, [chat, contacts, user]);

  const onClickSearch = () => {};

  const handleSelectMenuItem = (index: number) => {
    switch (index) {
      case 0:
        onDisplayContactInfo();
        return;
      case 1:
        return;
      case 2:
        onCloseChat(chat._id);
        return;
      case 3:
        return;
      case 4:
        return;
      case 5:
        messageApi.deleteMessagesOnChat(chat._id).then(() => {
          socket.emit('deleteMessagesOnChat', chat._id);
          dispatch(messagesActions.deleteMessagesOnChat(chat._id));
        });
        return;
      case 6:
        chatApi.deleteChat(chat._id).then(() => {
          socket.emit('deleteChat', chat._id);
          dispatch(chatsActions.deleteChat(chat._id));
          onDeleteChat(chat._id);
        });
        return;
    }
  };

  if (!otherParticipant) {
    return <div className={['chatHeader', className].join(' ')}></div>;
  }

  return (
    <div className={['chatHeader', className].join(' ')}>
      <div className={'chatHeader__icons'}>
        <Avatar
          avatarUrl={
            chat.participants.length > 2 // Is it a group ?
              ? chat.picture
              : otherParticipant.profile.picture
          }
          iconClassName="chatHeader__icon chatHeader__icon--left"
          onClick={onDisplayContactInfo}
        />
      </div>
      <div className="chatHeader__infos">
        <span className="chatHeader__infos__title">
          {otherParticipant.username}
        </span>
        <span className="chatHeader__infos__subtitle">
          {otherParticipant.online ? 'En ligne' : 'Hors ligne'}
        </span>
      </div>
      <div className="chatHeader__icons">
        <MdOutlineSearch
          className="chatHeader__icon chatHeader__icon--right"
          onClick={onClickSearch}
        />
        <IconWithMenu
          Icon={MdMoreVert}
          iconClassName={'chatHeader__icon chatHeader__icon--right'}
          useHoverColor
          menuItems={[
            'Infos du contact',
            'Sélectionner des messages',
            'Fermer la discussion',
            'Notifications en mode silencieux',
            'Messages éphémères',
            'Effacer les messages',
            'Supprimer la discussion',
          ]}
          onSelectMenuItem={handleSelectMenuItem}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
