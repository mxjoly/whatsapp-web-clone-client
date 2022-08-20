import React from 'react';

import UserItem from '../../molecules/UserItem';
import './styles.scss';

type UserListProps = {
  onSelectUser?: (userId: string) => void;
  users: User[];
};

const UserList = ({ onSelectUser, users }: UserListProps) => {
  return (
    <div className="userList">
      {users
        .sort((user1, user2) => user1.username.localeCompare(user2.username))
        .map((user, index, users) => {
          let Letter: any = null;

          if (index === 0) {
            Letter = () => (
              <div className="userList__letter">
                <div className="userList__letter--left">
                  {users[index].username.at(0)}
                </div>
                <div className="userList__letter--right"></div>
              </div>
            );
          } else if (
            index > 0 &&
            users[index - 1].username.at(0) !== users[index].username.at(0)
          ) {
            Letter = () => (
              <div className="userList__letter">
                <div className="userList__letter--left">
                  {users[index].username.at(0)}
                </div>
                <div className="userList__letter--right"></div>
              </div>
            );
          }

          return Letter ? (
            <React.Fragment key={index}>
              <Letter />
              <UserItem key={user._id} {...user} onSelectUser={onSelectUser} />
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>
              <UserItem key={user._id} {...user} onSelectUser={onSelectUser} />
            </React.Fragment>
          );
        })}
    </div>
  );
};

export default UserList;
