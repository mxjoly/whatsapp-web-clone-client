import React from 'react';
import { createChat } from '../../../api/chat';
import { mongoObjectId } from '../../../utils/id';

import UserPanel from '../UserPanel';
import Header from '../../organisms/LeftPanelHeader';
import NotificationPanel from '../../organisms/NotificationPanel';
import SearchBarPanel from '../../organisms/SearchBarPanel';
import ChatList from '../../organisms/ChatList';
import ArchiveItem from '../../molecules/ArchiveItem';
import ArchivePanel from '../ArchivePanel';
import NewChatPanel from '../NewChatPanel';
import './styles.scss';

type LeftPanelProps = {
  className?: string;
  onSelectChat?: (chat: Chat) => void;
  onDeleteChat?: (chatId: string) => void;
  onArchiveChat?: (chatId: string) => void;
  onUnarchiveChat?: (chatId: string) => void;
  chatSelected?: Chat;
  chats: Chat[];
  user: User;
  messages: Message[];
  contacts: User[];
};

const LeftPanel = ({
  className,
  onSelectChat,
  onDeleteChat,
  onArchiveChat,
  onUnarchiveChat,
  chatSelected,
  chats,
  user,
  messages,
  contacts,
}: LeftPanelProps): JSX.Element => {
  const [ready, setReady] = React.useState(true);
  const [search, setSearch] = React.useState<string>('');

  const [displayUserInfo, setDisplayUserInfo] = React.useState(false);
  const [displayArchivePanel, setDisplayArchivePanel] = React.useState(false);
  const [displayNewChatPanel, setDisplayNewChatPanel] = React.useState(false);
  const [displayNotificationPanel, setDisplayNotificationPanel] =
    React.useState(true);

  React.useEffect(() => {
    if (
      localStorage.getItem('displayNotificationPanel') &&
      localStorage.getItem('displayNotificationPanel') !== 'true'
    ) {
      setDisplayNotificationPanel(false);
    }
    setReady(true);
  }, [displayNotificationPanel]);

  const handleCloseNotificationPanel = () => {
    localStorage.setItem('displayNotificationPanel', 'true');
    setDisplayNotificationPanel(false);
  };

  const handleSelectUser = (userId: string) => {
    const chat = chats.find(
      (chat) =>
        chat.participants.includes(userId) &&
        chat.participants.includes(user._id)
    );
    if (chat) {
      onSelectChat(chat);
      setDisplayNewChatPanel(false);
    } else {
      createChat({
        _id: mongoObjectId(),
        archived: false,
        participants: [user._id, userId],
        title: '',
        picture: '',
      }).then((chat) => {
        onSelectChat(chat);
        setDisplayNewChatPanel(false);
      });
    }
  };

  if (!ready) {
    return <div className={['leftPanel', className].join(' ')}></div>;
  }

  return (
    <div className={['leftPanel', className].join(' ')}>
      <UserPanel
        className={[
          'leftPanel__userInfo',
          displayUserInfo && 'leftPanel__userInfo--active',
        ]
          .filter(Boolean)
          .join(' ')}
        user={user}
        onBack={() => setDisplayUserInfo(false)}
        isOpen={displayUserInfo}
      />
      <ArchivePanel
        chats={chats.filter((chat) => chat.archived)}
        messages={messages}
        isOpen={displayArchivePanel}
        onBack={() => setDisplayArchivePanel(false)}
        chatSelected={chatSelected}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        onUnarchiveChat={onUnarchiveChat}
      />
      <NewChatPanel
        isOpen={displayNewChatPanel}
        users={contacts}
        onSelectUser={handleSelectUser}
        onBack={() => setDisplayNewChatPanel(false)}
      />
      <Header
        onClickAvatar={() => setDisplayUserInfo(true)}
        onClickChat={() => setDisplayNewChatPanel(true)}
        onClickData={() => null}
        user={user}
      />
      {displayNotificationPanel && (
        <NotificationPanel
          onActivation={() => null}
          onClose={handleCloseNotificationPanel}
        />
      )}
      <SearchBarPanel onChangeSearch={setSearch} />
      <ArchiveItem
        className="leftPanel__archiveItem"
        onClick={() => setDisplayArchivePanel(true)}
      />
      <ChatList
        chats={chats.filter((chat) => {
          // If it's a group, the title of chat is the title props, else it's
          // the username of the other participants
          if (chat.participants.length > 2) {
            return (
              chat.title.toUpperCase().indexOf(search.toUpperCase()) > -1 &&
              !chat.archived
            );
          } else {
            const otherParticipantId =
              chat.participants[0] === user._id
                ? chat.participants[1]
                : chat.participants[0];

            const otherParticipant = contacts.find(
              (contact) => contact._id === otherParticipantId
            );
            return (
              otherParticipant.username
                .toUpperCase()
                .indexOf(search.toUpperCase()) > -1 && !chat.archived
            );
          }
        })}
        messages={messages}
        onSelectChat={onSelectChat}
        chatSelected={chatSelected}
        chatMenuItems={[
          'Archiver la discussion',
          'Notifications en mode silencieux',
          'Supprimer la discussion',
          'Épingler la discussion',
          'Marquer comme non lu',
        ]}
        onSelectChatMenuItems={(index, chatId) => {
          switch (index) {
            case 0:
              onArchiveChat(chatId);
              return;
            case 1:
              return;
            case 2:
              onDeleteChat(chatId);
              return;
            case 3:
              return;
            case 4:
              return;
          }
        }}
      />
    </div>
  );
};

export default LeftPanel;
