import { produce } from 'immer';
import { ActionTypes } from './actions';
import { Action, UserState } from './types';

export const initialState: UserState = Object.freeze({
  user: null,
  contacts: [],
});

const reducer = (state: UserState = initialState, action: Action): UserState =>
  produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.SAVE_USER: {
        draft.user = action.payload;
        return;
      }

      case ActionTypes.LOGIN_USER: {
        draft.user = {
          ...draft.user,
          online: true,
        };
        return;
      }

      case ActionTypes.LOGOUT_USER: {
        draft.user = {
          ...draft.user,
          online: false,
        };
        return;
      }

      case ActionTypes.UPDATE_USER: {
        draft.user = {
          ...draft.user,
          ...action.payload,
        };
        return;
      }

      case ActionTypes.SAVE_CONTACTS: {
        draft.contacts = action.payload;
        return;
      }

      case ActionTypes.CLEAR: {
        draft = initialState;
        return;
      }
    }
  });

export default reducer;
