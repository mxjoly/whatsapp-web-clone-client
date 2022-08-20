export type ChatsState = Readonly<{
  chats: Chat[];
}>;

export type Action = {
  type: string;
  payload?: any;
};
