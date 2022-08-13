import React from 'react';
import dayjs from 'dayjs';

import MessageBox from '../../molecules/MessageBox';
import DayBox from '../../atoms/DayBox';
import './styles.scss';

type MessageViewProps = {
  className?: string;
  messages: Message[];
};

const MessageView = ({ className, messages }: MessageViewProps) => {
  const ref = React.useRef<HTMLDivElement>();
  const myId = localStorage.getItem('userId');

  if (messages.length > 1) {
    messages = messages.sort(
      (msg1, msg2) => msg1.createdAt.valueOf() - msg2.createdAt.valueOf()
    );
  }

  React.useEffect(() => {
    ref.current.scrollBy({ top: ref.current.scrollHeight });
  }, [messages]);

  return (
    <div ref={ref} className={['messageView', className].join(' ')}>
      {messages.length === 0
        ? null
        : messages.map((message, index, messages) => {
            let Day: () => JSX.Element;

            if (index === 0) {
              Day = () => (
                <div className="messageView__row messageView__row--center">
                  <DayBox date={messages[index].createdAt} />
                </div>
              );
            } else if (
              dayjs(messages[index].createdAt).format('D/MM/YYYY') !==
              dayjs(messages[index - 1].createdAt).format('D/MM/YYYY')
            ) {
              Day = () => (
                <div className="messageView__row messageView__row--center">
                  <DayBox date={messages[index].createdAt} />
                </div>
              );
            }

            const Base = () => (
              <div
                className={[
                  'messageView__row',
                  message.senderId === myId
                    ? 'messageView__row--right'
                    : 'messageView__row--left',
                ].join(' ')}
              >
                <MessageBox
                  className={[
                    'messageView__message',
                    message.senderId === myId
                      ? 'messageView__message--right'
                      : 'messageView__message--left',
                  ].join(' ')}
                  message={message}
                  side={message.senderId === myId ? 'right' : 'left'}
                />
              </div>
            );

            return Day ? (
              <React.Fragment key={index}>
                <Day />
                <Base />
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>
                <Base />
              </React.Fragment>
            );
          })}
    </div>
  );
};

export default MessageView;
