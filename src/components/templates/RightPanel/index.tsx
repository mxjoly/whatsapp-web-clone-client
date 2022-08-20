import React from 'react';
import { MdComputer } from 'react-icons/md';
import { HiLockClosed } from 'react-icons/hi';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { ThemeContext } from '../../../contexts/ThemeContext';
import ChatView from '../../organisms/ChatView';
import ChatInfoPanel from '../ChatInfoPanel';
import './styles.scss';

type RightPanelProps = {
  className?: string;
  displayChat?: boolean;
  chatSelected?: Chat;
  onCloseChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
};

const RightPanel = ({
  className,
  displayChat,
  chatSelected,
  onCloseChat,
  onDeleteChat,
}: RightPanelProps): JSX.Element => {
  const [ready, setReady] = React.useState(false);
  const [displayContactInfo, setDisplayContactInfo] = React.useState(false);

  const platform =
    navigator.platform === 'Win32'
      ? 'Windows'
      : navigator.platform === 'MacIntel'
      ? 'Mac'
      : navigator.platform === 'Linux x86_64'
      ? 'Linux'
      : 'Unknown';

  return (
    <div className={['rightPanel', className].join(' ')}>
      {displayChat && chatSelected ? (
        <>
          <ChatView
            className={[
              'rightPanel__chatView',
              displayContactInfo && 'rightPanel__chatView--reduce',
            ]
              .filter(Boolean)
              .join(' ')}
            chat={chatSelected}
            onCloseChat={onCloseChat}
            onDeleteChat={onDeleteChat}
            onDisplayContactInfo={() => setDisplayContactInfo(true)}
          />
          <ChatInfoPanel
            className={[
              'rightPanel__chatInfo',
              displayContactInfo && 'rightPanel__chatInfo--active',
            ]
              .filter(Boolean)
              .join(' ')}
            chat={displayContactInfo ? chatSelected : null}
            onClose={() => setDisplayContactInfo(false)}
            onDeleteChat={onDeleteChat}
          />
        </>
      ) : (
        <div
          className={[
            'rightPanel__container',
            !ready && 'rightPanel__container--hide',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{ opacity: ready ? 1 : 0 }}
        >
          <ThemeContext.Consumer>
            {({ isDark }) => (
              <LazyLoadImage
                alt="background"
                className="rightPanel__image"
                afterLoad={() => setReady(true)}
                src={
                  isDark
                    ? './images/phone-laptop-dark.png'
                    : './images/phone-laptop.png'
                }
              />
            )}
          </ThemeContext.Consumer>
          <h3 className="rightPanel__title">WhatsApp Web</h3>
          <p className="rightPanel__p">
            Envoyez et recevez désormais des messages sans avoir à garder votre
            téléphone en ligne.
          </p>
          <p className="rightPanel__p">
            Utilisez WhatsApp sur un maximum de 4 appareils et 1 téléphone,
            simultanément.
          </p>
          <div className="rightPanel__divider"></div>
          <div className="rightPanel__row">
            <MdComputer className="rightPanel__icon rightPanel__icon--normal" />
            <p className="rightPanel__p">
              Passez des appels depuis votre ordinateur avec WhatsApp pour{' '}
              {platform}.{' '}
              <a href="#" target="_blank" className="rightPanel__link">
                Obtenir l'application ici
              </a>
            </p>
          </div>
          <div className="rightPanel__footer">
            <div className="rightPanel__row">
              <HiLockClosed
                className="rightPanel__icon rightPanel__icon--small"
                style={{ marginRight: 5 }}
              />
              <p className="rightPanel__p">Chiffré de bout en bout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
