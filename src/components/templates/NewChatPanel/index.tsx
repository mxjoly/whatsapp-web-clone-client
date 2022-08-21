import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';

import { MdArrowBack } from 'react-icons/md';
import SearchBarPanel from '../../organisms/SearchBarPanel';
import UserList from '../../organisms/UserList';
import './styles.scss';

type NewChatPanelProps = {
  className?: string;
  onBack?: () => void;
  onSelectUser?: (userId: string) => void;
  isOpen: boolean;
};

const NewChatPanel = ({
  className,
  isOpen,
  onBack,
  onSelectUser,
}: NewChatPanelProps) => {
  const [search, setSearch] = React.useState('');
  const contacts = useSelector<RootState, User[]>(
    (state) => state.user.contacts
  );

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
      {contacts.length > 0 ? (
        <UserList
          users={contacts.filter(
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
