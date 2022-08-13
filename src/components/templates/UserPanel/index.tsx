import React from 'react';
import axios from 'axios';

import { MdArrowBack, MdEdit } from 'react-icons/md';
import Avatar from '../../atoms/Avatar';
import './styles.scss';

type UserPanelProps = {
  className?: string;
  user: User;
  onBack?: () => void;
  isOpen: boolean;
};

const UserPanel = ({ className, user, onBack, isOpen }: UserPanelProps) => {
  const [username, setUsername] = React.useState(user.username);
  const [status, setStatus] = React.useState(user.profile.status);
  const usernameInputRef = React.useRef<HTMLInputElement>();
  const statusInputRef = React.useRef<HTMLInputElement>();

  const updateUsername = (newUsername: string) => {
    if (newUsername === user.username) return;

    axios({
      method: 'post',
      url: `${axios.defaults.baseURL}/user/update/${user._id}`,
      data: {
        ...user,
        username: newUsername,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`Username updated`);
        }
      })
      .catch(() => console.error(`Failed to update the username`));
  };

  const updateStatus = (newStatus: string) => {
    if (newStatus === user.profile.status) return;

    axios({
      method: 'post',
      url: `${axios.defaults.baseURL}/user/update/${user._id}`,
      data: {
        ...user,
        profile: {
          ...user.profile,
          status: user.profile.status,
        },
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`Status updated`);
        }
      })
      .catch(() => console.error(`Failed to update the status`));
  };

  React.useEffect(() => {
    const onPress = (event: KeyboardEvent) => {
      if (
        document.activeElement === usernameInputRef.current &&
        event.key === 'Enter'
      ) {
        updateUsername(username);
        usernameInputRef.current.blur();
      }
      if (
        document.activeElement === statusInputRef.current &&
        event.key === 'Enter'
      ) {
        updateStatus(status);
        statusInputRef.current.blur();
      }
    };

    document.addEventListener('keydown', onPress);
    return () => document.removeEventListener('keydown', onPress);
  }, [username, status]);

  const sectionClasses = [
    'userPanel__section',
    isOpen && 'userPanel__section--animate',
  ]
    .filter(Boolean)
    .join(' ');

  const avatarClasses = [
    'userPanel__avatar',
    isOpen && 'userPanel__avatar--animate',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={['userPanel', className].join(' ')}>
      <div className="userPanel__header">
        <MdArrowBack className="userPanel__header__arrow" onClick={onBack} />
        <span className="userPanel__header__title">Profil</span>
      </div>
      <Avatar avatarUrl={user.profile.picture} iconClassName={avatarClasses} />
      <div className={sectionClasses}>
        <span className="userPanel__section__title">Votre nom</span>
        <div className="userPanel__section__row">
          <input
            ref={usernameInputRef}
            className="userPanel__section__label"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={() => updateUsername(username)}
          />
          <MdEdit
            className="userPanel__section__edit"
            onClick={() => usernameInputRef.current.focus()}
          />
        </div>
        <span className="userPanel__section__info">
          Ce n'est pas votre nom d'utilisateur ou code pin. Ce nom sera visible
          auprès de vos contacts WhatsApp.
        </span>
      </div>
      <div className={sectionClasses}>
        <span className="userPanel__section__title">Actu</span>
        <div className="userPanel__section__row">
          <input
            ref={statusInputRef}
            className="userPanel__section__label"
            value={status}
            type="text"
            onChange={(e) => setStatus(e.target.value)}
            onBlur={() => updateStatus(status)}
          />
          <MdEdit
            className="userPanel__section__edit"
            onClick={() => statusInputRef.current.focus()}
          />
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
