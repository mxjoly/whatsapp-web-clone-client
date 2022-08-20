export const ActionTypes = {
  SAVE_MESSAGES: '/messages/save-messages',
  UPDATE_MESSAGE: '/messages/update-message',
  ADD_MESSAGE: '/messages/add-message',
  DELETE_MESSAGE: '/messages/delete-message',
  DELETE_MESSAGES_ON_CHAT: '/messages/delete-messages-on-chat',
  CLEAR_MESSAGES: '/messages/clear-messages',
};

export const saveMessages = (messages: Message[]) => ({
  type: ActionTypes.SAVE_MESSAGES,
  payload: messages,
});

export const updateMessage = (messageId: string, newProps: Message) => ({
  type: ActionTypes.UPDATE_MESSAGE,
  payload: {
    messageId,
    props: { ...newProps },
  },
});

export const addMessage = (newMessage: Message) => ({
  type: ActionTypes.ADD_MESSAGE,
  payload: newMessage,
});

export const deleteMessage = (messageId: string) => ({
  type: ActionTypes.DELETE_MESSAGE,
  payload: messageId,
});

export const deleteMessagesOnChat = (chatId: string) => ({
  type: ActionTypes.DELETE_MESSAGES_ON_CHAT,
  payload: chatId,
});

export const clearMessages = () => ({
  type: ActionTypes.CLEAR_MESSAGES,
});
