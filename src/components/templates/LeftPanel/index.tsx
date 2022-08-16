import React from 'react';
import './styles.scss';

import UserPanel from '../UserPanel';
import Header from '../../organisms/LeftPanelHeader';
import NotificationPanel from '../../organisms/NotificationPanel';
import SearchBarPanel from '../../organisms/SearchBarPanel';
import ChatList from '../../organisms/ChatList';
import ArchiveItem from '../../organisms/ArchiveItem';
import ArchivePanel from '../ArchivePanel';

type LeftPanelProps = {
  className?: string;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onArchiveChat?: (chatId: string) => void;
  onUnarchiveChat?: (chatId: string) => void;
  chatSelected?: Chat;
  chats: Chat[];
  user: User;
  messages: Message[];
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
}: LeftPanelProps): JSX.Element => {
  const [ready, setReady] = React.useState(true);
  const [search, setSearch] = React.useState<string>('');
  const [displayUserInfo, setDisplayUserInfo] = React.useState(false);
  const [displayArchivePanel, setDisplayArchivePanel] = React.useState(false);
  const [displayNotificationPanel, setDisplayNotificationPanel] =
    React.useState(true);

  React.useEffect(() => {
    if (
      localStorage.getItem('displayNotificationPanel') &&
      localStorage.getItem('displayNotificationPanel') !== 'true'
    ) {
      setDisplayNotificationPanel(false);
      setReady(true);
    } else {
      setReady(true);
    }
  }, [displayNotificationPanel]);

  const handleCloseNotificationPanel = () => {
    localStorage.setItem('displayNotificationPanel', 'true');
    setDisplayNotificationPanel(false);
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
      <Header
        onClickAvatar={() => setDisplayUserInfo(true)}
        onClickChat={() => null}
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
        chats={chats.filter(
          (chat) =>
            chat.title.toUpperCase().indexOf(search.toUpperCase()) > -1 &&
            !chat.archived
        )}
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
