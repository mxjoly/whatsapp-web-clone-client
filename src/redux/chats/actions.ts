export const ActionTypes = {
  SAVE_CHATS: '/chats/save-chats',
  UPDATE_CHAT: '/chats/update-chat',
  ADD_CHAT: '/chats/add-chat',
  DELETE_CHAT: '/chats/delete-chat',
  CLEAR_CHATS: '/chats/clear-chats',
};

export const saveChats = (chats: Chat[]) => ({
  type: ActionTypes.SAVE_CHATS,
  payload: chats,
});

export const updateChat = (chatId: string, newProps: Chat) => ({
  type: ActionTypes.UPDATE_CHAT,
  payload: {
    chatId,
    props: { ...newProps },
  },
});

export const addChat = (newChat: Chat) => ({
  type: ActionTypes.ADD_CHAT,
  payload: newChat,
});

export const deleteChat = (chatId: string) => ({
  type: ActionTypes.DELETE_CHAT,
  payload: chatId,
});

export const clearChats = () => ({
  type: ActionTypes.CLEAR_CHATS,
});
