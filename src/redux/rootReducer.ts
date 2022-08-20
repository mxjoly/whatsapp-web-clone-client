import { combineReducers } from 'redux';

import user, { initialState as usersInitialState } from './user/reducer';
import chats, { initialState as chatsInitialState } from './chats/reducer';
import messages, {
  initialState as messagesInitialState,
} from './messages/reducer';

import { UserState } from './user/types';
import { ChatsState } from './chats/types';
import { MessagesState } from './messages/types';

export type RootState = Readonly<{
  user: UserState;
  chats: ChatsState;
  messages: MessagesState;
}>;

export const initialRootState: RootState = {
  user: usersInitialState,
  chats: chatsInitialState,
  messages: messagesInitialState,
};

export default combineReducers<RootState>({ user, chats, messages });
