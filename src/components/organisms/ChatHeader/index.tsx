import React from 'react';
import { getUser } from '../../../api/user';
import { deleteMessagesOnChat } from '../../../api/message';

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
  const [otherParticipant, setOtherParticipant] = React.useState<User>(null);

  React.useEffect(() => {
    const otherParticipantId =
      chat.participants[0] === localStorage.getItem('userId')
        ? chat.participants[1]
        : chat.participants[0];

    getUser(otherParticipantId).then((user) => {
      setOtherParticipant(user);
    });
  }, [chat]);

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
        deleteMessagesOnChat(chat._id);
        return;
      case 6:
        onDeleteChat(chat._id);
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
          avatarUrl={chat ? chat.picture : ''}
          iconClassName="chatHeader__icon chatHeader__icon--left"
          onClick={onDisplayContactInfo}
        />
      </div>
      <div className="chatHeader__infos">
        <span className="chatHeader__infos__title">{chat.title}</span>
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
