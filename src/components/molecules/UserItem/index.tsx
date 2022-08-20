import React from 'react';

import Avatar from '../../atoms/Avatar';
import './styles.scss';

type UserItemProps = {
  _id: string;
  username: string;
  password: string;
  profile: Profile;
  online: boolean;
  contacts: string[];
  onSelectUser?: (chatId: string) => void;
};

const UserItem = ({ _id, profile, username, onSelectUser }: UserItemProps) => {
  return (
    <div className="userItem" onClick={() => onSelectUser(_id)}>
      <div className="userItem__container--left">
        <Avatar
          iconClassName="userItem__avatar"
          avatarUrl={profile.picture}
          large
        />
      </div>
      <div className="userItem__container--right">
        <span className="userItem__username">{username}</span>
        <span className="userItem__status">{profile.status}</span>
      </div>
    </div>
  );
};

export default UserItem;
