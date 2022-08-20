import React from 'react';

import { MdArrowBack } from 'react-icons/md';
import SearchBarPanel from '../../organisms/SearchBarPanel';
import UserList from '../../organisms/UserList';
import './styles.scss';

type NewChatPanelProps = {
  className?: string;
  onBack?: () => void;
  onSelectUser?: (userId: string) => void;
  isOpen: boolean;
  users: User[];
};

const NewChatPanel = ({
  className,
  isOpen,
  onBack,
  onSelectUser,
  users,
}: NewChatPanelProps) => {
  const [search, setSearch] = React.useState('');

  const rootClasses = [
    'newChatPanel',
    className,
    isOpen && 'newChatPanel--show',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <div className="newChatPanel__header">
        <MdArrowBack className="newChatPanel__header__arrow" onClick={onBack} />
        <span className="newChatPanel__header__title">Nouvelle discussion</span>
      </div>
      <SearchBarPanel onChangeSearch={setSearch} />
      {users.length > 0 ? (
        <UserList
          users={users.filter(
            (user) =>
              user.username.toUpperCase().indexOf(search.toUpperCase()) > -1
          )}
          onSelectUser={onSelectUser}
        />
      ) : (
        <p className="newChatPanel__info">Pas de contacts</p>
      )}
    </div>
  );
};

export default NewChatPanel;
