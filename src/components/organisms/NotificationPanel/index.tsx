import React from 'react';
import { MdNotificationsOff, MdChevronRight } from 'react-icons/md';
import './styles.scss';

type NotificationPanelProps = {
  className?: string;
  onClick?: () => void;
};

const NotificationPanel = ({ className, onClick }: NotificationPanelProps) => {
  return (
    <div
      className={['notificationPanel', className].join(' ')}
      onClick={onClick}
    >
      <div className="notificationPanel__content--left">
        <MdNotificationsOff className="notificationPanel__icon" />
      </div>
      <div className="notificationPanel__content--right">
        <p className="notificationPanel__title">
          Être averti(e) des nouveaux messages
        </p>
        <a className="notificationPanel__link" href="#">
          Activer les notifications sur le bureau{' '}
          <MdChevronRight className="notificationPanel__link__chevron" />
        </a>
      </div>
    </div>
  );
};

export default NotificationPanel;
