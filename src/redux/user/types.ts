export type UserState = Readonly<{
  user: User;
  contacts: User[];
}>;

export type Action = {
  type: string;
  payload?: any;
};
