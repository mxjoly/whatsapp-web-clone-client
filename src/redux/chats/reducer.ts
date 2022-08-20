import { produce } from 'immer';
import { ActionTypes } from './actions';
import { Action, ChatsState } from './types';

export const initialState: ChatsState = Object.freeze({
  chats: [],
});

const reducer = (
  state: ChatsState = initialState,
  action: Action
): ChatsState =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.SAVE_CHATS: {
        draft.chats = action.payload;
        return;
      }

      case ActionTypes.ADD_CHAT: {
        if (
          draft.chats.findIndex((chat) => chat._id === action.payload._id) ===
          -1
        ) {
          draft.chats.push(action.payload);
        }
        return;
      }

      case ActionTypes.DELETE_CHAT: {
        draft.chats = draft.chats.filter((chat) => chat._id !== action.payload);
        return;
      }

      case ActionTypes.CLEAR_CHATS: {
        draft = initialState;
        return;
      }

      case ActionTypes.UPDATE_CHAT: {
        draft.chats = draft.chats.map((chat) => {
          if (chat._id === action.payload.chatId) {
            return {
              ...chat,
              ...action.payload.props,
            };
          }
          return chat;
        });
        return;
      }
    }
  });

export default reducer;
