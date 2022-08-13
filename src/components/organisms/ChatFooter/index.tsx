import React from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { MdAttachFile, MdSend } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';

import './styles.scss';

type ChatFooterProps = {
  className?: string;
  onSendClick?: (messageContent: MessageContent) => void;
};

const ChatFooter = ({ className, onSendClick }: ChatFooterProps) => {
  const [areaRows, setAreaRows] = React.useState(1);
  const areaRef = React.useRef<HTMLTextAreaElement>();
  const [messageContent, setMessageContent] = React.useState<MessageContent>({
    text: '',
    pictureUrl: '',
    audioUrl: '',
  });

  React.useEffect(() => {
    const onPress = (event: KeyboardEvent) => {
      if (document.activeElement === areaRef.current) {
        if (event.altKey && event.key === 'Enter') {
          setMessageContent((content) => ({
            ...content,
            text: content.text + '\n',
          }));
          setAreaRows((row) => row + 1);
        } else if (event.key === 'Enter') {
          onSendMessage(messageContent);
        } else if (
          event.key === 'Backspace' &&
          areaRef.current.value.endsWith('\n')
        ) {
          setAreaRows((row) => row - 1);
        }
      }
    };

    document.addEventListener('keydown', onPress);
    return () => document.removeEventListener('keydown', onPress);
  }, [messageContent]);

  const onEmojiClick = () => {};
  const onAttachFileClick = () => {};
  const onMicrophoneClick = () => {};

  const onSendMessage = (messageContent: MessageContent) => {
    if (messageContent.text !== '') {
      onSendClick(messageContent);
      setMessageContent(messageContent);
      setAreaRows(1);
    } else {
      console.log('Nothing to send. Text is empty.');
    }
  };

  return (
    <div className={['chatFooter', className].join(' ')}>
      <BsEmojiSmile className="chatFooter__icon" onClick={onEmojiClick} />
      <MdAttachFile className="chatFooter__icon" onClick={onAttachFileClick} />
      <textarea
        ref={areaRef}
        className="chatFooter__textarea"
        value={messageContent.text}
        onChange={(e) =>
          setMessageContent((content) => ({ ...content, text: e.target.value }))
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        placeholder="Taper un message"
        autoComplete="off"
        rows={areaRows}
      ></textarea>
      {messageContent.text === '' ? (
        <FaMicrophone
          className="chatFooter__icon"
          onClick={onMicrophoneClick}
        />
      ) : (
        <MdSend
          className="chatFooter__icon"
          onClick={() => onSendMessage(messageContent)}
        />
      )}
    </div>
  );
};

export default ChatFooter;
