import React from 'react';
import './styles.scss';

import UserPanel from '../UserPanel';
import Header from '../../organisms/LeftPanelHeader';
import NotificationPanel from '../../organisms/NotificationPanel';
import SearchBarPanel from '../../organisms/SearchBarPanel';
import ChatList from '../../organisms/ChatList';

type LeftPanelProps = {
  className?: string;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  chatSelected?: Chat;
  chats: Chat[];
  user: User;
  messages: Message[];
};

const LeftPanel = ({
  className,
  onSelectChat,
  onDeleteChat,
  chatSelected,
  chats,
  user,
  messages,
}: LeftPanelProps): JSX.Element => {
  const [search, setSearch] = React.useState<string>('');
  const [displayUserInfo, setDisplayUserInfo] = React.useState(false);

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
      <Header
        onClickAvatar={() => setDisplayUserInfo(true)}
        onClickChat={() => null}
        onClickData={() => null}
        user={user}
      />
      <NotificationPanel onClick={() => null} />
      <SearchBarPanel onChangeSearch={setSearch} />
      <ChatList
        chats={chats.filter(
          (chat) => chat.title.toUpperCase().indexOf(search.toUpperCase()) > -1
        )}
        messages={messages}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        chatSelected={chatSelected}
        onClickArchive={() => null}
      />
    </div>
  );
};

export default LeftPanel;
