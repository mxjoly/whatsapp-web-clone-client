import React from 'react';

import { MdArrowBack } from 'react-icons/md';
import './styles.scss';
import ChatList from '../../organisms/ChatList';

type ArchivePanelProps = {
  className?: string;
  onBack?: () => void;
  onSelectChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onUnarchiveChat?: (chatId: string) => void;
  isOpen: boolean;
  chatSelected: Chat;
  chats: Chat[];
  messages: Message[];
};

const ArchivePanel = ({
  className,
  isOpen,
  onBack,
  onSelectChat,
  onDeleteChat,
  onUnarchiveChat,
  chatSelected,
  chats,
  messages,
}: ArchivePanelProps) => {
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
    switch (index) {
      case 0:
        onUnarchiveChat(chatId);
        return;
      case 1:
        onDeleteChat(chatId);
        return;
      case 2:
        return;
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
          messages={messages}
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
