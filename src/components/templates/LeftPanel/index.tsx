import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { mongoObjectId } from '../../../utils/id';
import * as chatApi from '../../../api/chat';
import * as chatsActions from '../../../redux/chats/actions';

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
  chatSelected?: Chat;
};

const LeftPanel = ({
  className,
  onSelectChat,
  chatSelected,
}: LeftPanelProps): JSX.Element => {
  const [ready, setReady] = React.useState(true);
  const [search, setSearch] = React.useState<string>('');

  const dispatch = useDispatch();
  const chats = useSelector<RootState, Chat[]>((state) => state.chats.chats);
  const user = useSelector<RootState, User>((state) => state.user.user);
  const contacts = useSelector<RootState, User[]>(
    (state) => state.user.contacts
  );

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
  }, [displayNotificationPanel, chats]);

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
      chatApi
        .createChat({
          _id: mongoObjectId(),
          archived: false,
          participants: [user._id, userId],
          title: '',
          picture: '',
        })
        .then((chat) => {
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
        onBack={() => setDisplayUserInfo(false)}
        isOpen={displayUserInfo}
      />
      <ArchivePanel
        isOpen={displayArchivePanel}
        onBack={() => setDisplayArchivePanel(false)}
        chatSelected={chatSelected}
        onSelectChat={onSelectChat}
      />
      <NewChatPanel
        isOpen={displayNewChatPanel}
        onSelectUser={handleSelectUser}
        onBack={() => setDisplayNewChatPanel(false)}
      />
      <Header
        onClickAvatar={() => setDisplayUserInfo(true)}
        onClickChat={() => setDisplayNewChatPanel(true)}
        onClickData={() => null}
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
        chats={chats
          .filter((chat) => !chat.archived)
          .filter((chat) => {
            // If it's a group, the title of chat is the title props, else it's
            // the username of the other participants
            if (chat.participants.length > 2) {
              return (
                chat.title.toUpperCase().indexOf(search.toUpperCase()) > -1
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
                  .indexOf(search.toUpperCase()) > -1
              );
            }
          })}
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
          const chat = chats.find((chat) => chat._id === chatId);
          switch (index) {
            case 0:
              chatApi
                .updateChat(chatId, { ...chat, archived: true })
                .then(() => {
                  dispatch(
                    chatsActions.updateChat(chatId, { ...chat, archived: true })
                  );
                });
              return;
            case 1:
              return;
            case 2:
              chatApi.deleteChat(chatId).then(() => {
                dispatch(chatsActions.deleteChat(chatId));
              });
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
