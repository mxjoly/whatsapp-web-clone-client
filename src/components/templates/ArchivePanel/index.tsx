import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as chatApi from '../../../api/chat';
import * as chatsAction from '../../../redux/chats/actions';
import { RootState } from '../../../redux/rootReducer';

import { MdArrowBack } from 'react-icons/md';
import './styles.scss';
import ChatList from '../../organisms/ChatList';

type ArchivePanelProps = {
  className?: string;
  onBack?: () => void;
  onSelectChat?: (chat: Chat) => void;
  isOpen: boolean;
  chatSelected: Chat;
};

const ArchivePanel = ({
  className,
  isOpen,
  onBack,
  onSelectChat,
  chatSelected,
}: ArchivePanelProps) => {
  const dispatch = useDispatch();
  const chats = useSelector<RootState, Chat[]>((state) =>
    state.chats.chats.filter((chat) => chat.archived)
  );

  const rootClasses = [
    'archivePanel',
    className,
    isOpen && 'archivePanel--show',
  ]
    .filter(Boolean)
    .join(' ');

  const menuItems = [
    'Désarchiver la discussion',
    'Supprimer la discussion',
    'Marquer comme non lu',
  ];

  const onSelectChatMenuItems = (index: number, chatId: string) => {
    const chat = chats.find((chat) => chat._id === chatId);
    if (chat) {
      switch (index) {
        case 0:
          chatApi.updateChat(chatId, { ...chat, archived: false }).then(() => {
            dispatch(
              chatsAction.updateChat(chatId, { ...chat, archived: false })
            );
          });
          return;
        case 1:
          chatApi.deleteChat(chatId).then(() => {
            dispatch(chatsAction.deleteChat(chatId));
          });
          return;
        case 2:
          return;
      }
    }
  };

  return (
    <div className={rootClasses}>
      <div className="archivePanel__header">
        <MdArrowBack className="archivePanel__header__arrow" onClick={onBack} />
        <span className="archivePanel__header__title">Archivées</span>
      </div>
      {chats.length > 0 ? (
        <ChatList
          chats={chats}
          chatSelected={chatSelected}
          onSelectChat={onSelectChat}
          chatMenuItems={menuItems}
          onSelectChatMenuItems={onSelectChatMenuItems}
        />
      ) : (
        <p className="archivePanel__info">Pas de conversations archivées</p>
      )}
    </div>
  );
};

export default ArchivePanel;
