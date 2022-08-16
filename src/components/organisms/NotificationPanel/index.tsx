import React from 'react';
import { MdNotificationsOff, MdChevronRight, MdClose } from 'react-icons/md';
import './styles.scss';

type NotificationPanelProps = {
  className?: string;
  onActivation?: () => void;
  onClose?: () => void;
};

const NotificationPanel = ({
  className,
  onActivation,
  onClose,
}: NotificationPanelProps) => {
  return (
    <div className={['notificationPanel', className].join(' ')}>
      <div className="notificationPanel__content--left">
        <MdNotificationsOff className="notificationPanel__icon" />
      </div>
      <div className="notificationPanel__content--right">
        <p className="notificationPanel__title">
          Être averti(e) des nouveaux messages
        </p>
        <a className="notificationPanel__link" href="#" onClick={onActivation}>
          Activer les notifications sur le bureau{' '}
          <MdChevronRight className="notificationPanel__link__chevron" />
        </a>
      </div>
      <MdClose className="notificationPanel__close" onClick={onClose} />
    </div>
  );
};

export default NotificationPanel;
