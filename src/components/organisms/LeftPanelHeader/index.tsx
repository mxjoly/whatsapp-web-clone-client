import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MdDataUsage, MdMoreVert, MdChat } from 'react-icons/md';

import IconWithMenu from '../../molecules/IconWithMenu';
import Avatar from '../../atoms/Avatar';
import './styles.scss';

type LeftPanelHeaderProps = {
  className?: string;
  onClickAvatar?: () => void;
  onClickData?: () => void;
  onClickChat?: () => void;
  user: User;
};

const LeftPanelHeader = ({
  className,
  onClickAvatar,
  onClickChat,
  onClickData,
  user,
}: LeftPanelHeaderProps): JSX.Element => {
  const navigate = useNavigate();

  const handleSelectMenuItem = (index: number) => {
    switch (index) {
      case 0:
        return;
      case 1:
        return;
      case 2:
        return;
      case 3:
        axios({
          method: 'post',
          url: `${axios.defaults.baseURL}/user/logout/${localStorage.getItem(
            'userId'
          )}`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
          .then((res) => {
            if (res.status === 200) {
              navigate('/login');
              localStorage.clear();
              console.log('Log out successfully');
            }
          })
          .catch(() => console.error(`Failed to disconnect`));
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
            'Paramètres',
            'Déconnexion',
          ]}
          onSelectMenuItem={handleSelectMenuItem}
        />
      </div>
    </div>
  );
};

export default LeftPanelHeader;
