import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as apiUser from '../../../api/user';
import * as userActions from '../../../redux/user/actions';
import { RootState } from '../../../redux/rootReducer';
import { useSocket } from '../../../contexts/SocketContext';

import { MdDataUsage, MdMoreVert, MdChat } from 'react-icons/md';
import IconWithMenu from '../../molecules/IconWithMenu';
import Avatar from '../../atoms/Avatar';
import './styles.scss';

type LeftPanelHeaderProps = {
  className?: string;
  onClickAvatar?: () => void;
  onClickData?: () => void;
  onClickChat?: () => void;
};

const LeftPanelHeader = ({
  className,
  onClickAvatar,
  onClickChat,
  onClickData,
}: LeftPanelHeaderProps): JSX.Element => {
  const socket = useSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector<RootState, User>((state) => state.user.user);

  const handleSelectMenuItem = (index: number) => {
    switch (index) {
      case 0:
        return;
      case 1:
        return;
      case 2:
        return;
      case 3:
        apiUser.logoutUser(user._id).then(() => {
          socket.emit('logoutUser', user._id);
          dispatch(userActions.logoutUser());
          navigate('/login');
          localStorage.clear();
        });
        return;
    }
  };

  return (
    <div className={['leftPanelHeader', className].join(' ')}>
      <div className="leftPanelHeader__icons">
        <Avatar
          avatarUrl={user.profile.picture ? user.profile.picture : null}
          iconClassName="leftPanelHeader__icon leftPanelHeader__icon--left"
          onClick={onClickAvatar}
        />
      </div>
      <div className="leftPanelHeader__icons">
        <MdDataUsage
          className="leftPanelHeader__icon leftPanelHeader__icon--right"
          onClick={onClickData}
        />
        <MdChat
          className="leftPanelHeader__icon leftPanelHeader__icon--right"
          onClick={onClickChat}
        />
        <IconWithMenu
          Icon={MdMoreVert}
          iconClassName={'leftPanelHeader__icon leftPanelHeader__icon--right'}
          useHoverColor
          menuItems={[
            'Nouveau groupe',
            'Messages importants',
            'Param??tres',
            'D??connexion',
          ]}
          onSelectMenuItem={handleSelectMenuItem}
        />
      </div>
    </div>
  );
};

export default LeftPanelHeader;
