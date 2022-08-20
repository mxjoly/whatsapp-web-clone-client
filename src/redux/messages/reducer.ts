import { produce } from 'immer';
import { ActionTypes } from './actions';
import { Action, MessagesState } from './types';

export const initialState: MessagesState = Object.freeze({
  messages: [],
});

const reducer = (
  state: MessagesState = initialState,
  action: Action
): MessagesState =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.SAVE_MESSAGES: {
        draft.messages = action.payload;
        return;
      }

      case ActionTypes.ADD_MESSAGE: {
        if (
          draft.messages.findIndex((msg) => msg._id === action.payload._id) ===
          -1
        ) {
          draft.messages.push(action.payload);
        }

        return;
      }

      case ActionTypes.DELETE_MESSAGE: {
        draft.messages = draft.messages.filter(
          (message) => message._id !== action.payload
        );
        return;
      }

      case ActionTypes.DELETE_MESSAGES_ON_CHAT: {
        draft.messages = draft.messages.filter(
          (message) => message.chatId !== action.payload
        );
        return;
      }

      case ActionTypes.CLEAR_MESSAGES: {
        draft = initialState;
        return;
      }

      case ActionTypes.UPDATE_MESSAGE: {
        draft.messages = draft.messages.map((message) => {
          if (message._id === action.payload.messageId) {
            return {
              ...message,
              ...action.payload.props,
            };
          }
          return message;
        });
        return;
      }
    }
  });

export default reducer;
