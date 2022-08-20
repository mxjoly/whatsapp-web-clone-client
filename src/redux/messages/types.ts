export type MessagesState = Readonly<{
  messages: Message[];
}>;

export type Action = {
  type: string;
  payload?: any;
};
