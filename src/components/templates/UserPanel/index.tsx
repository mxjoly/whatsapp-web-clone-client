import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../../contexts/SocketContext';
import { RootState } from '../../../redux/rootReducer';
import * as userApi from '../../../api/user';
import * as userActions from '../../../redux/user/actions';

import { MdArrowBack, MdEdit } from 'react-icons/md';
import Avatar from '../../atoms/Avatar';
import './styles.scss';

type UserPanelProps = {
  className?: string;
  onBack?: () => void;
  isOpen: boolean;
};

const UserPanel = ({ className, onBack, isOpen }: UserPanelProps) => {
  const dispatch = useDispatch();
  const socket = useSocket();

  const user = useSelector<RootState, User>((state) => state.user.user);
  const [username, setUsername] = React.useState(user.username);
  const [status, setStatus] = React.useState(user.profile.status);
  const usernameInputRef = React.useRef<HTMLInputElement>();
  const statusInputRef = React.useRef<HTMLInputElement>();

  const updateUsername = (newUsername: string) => {
    if (newUsername === user.username) return;

    const newProps: User = {
      ...user,
      username: newUsername,
    };

    userApi.updateUser(user._id, newProps).then(() => {
      socket.emit('updateUser', newProps);
      dispatch(userActions.updateUser(newProps));
    });
  };

  const updateStatus = (newStatus: string) => {
    if (newStatus === user.profile.status) return;

    const newProps: User = {
      ...user,
      profile: {
        ...user.profile,
        status: newStatus,
      },
    };

    userApi.updateUser(user._id, newProps).then(() => {
      socket.emit('updateUser', newProps);
      dispatch(userActions.updateUser(newProps));
    });
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
      <Avatar
        avatarUrl={user.profile.picture}
        iconClassName={avatarClasses}
        editable
      />
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
