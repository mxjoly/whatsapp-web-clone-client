export const ActionTypes = {
  SAVE_USER: '/user/save-user',
  LOGIN_USER: '/user/login-user',
  LOGOUT_USER: '/user/logout-user',
  UPDATE_USER: '/user/update-user',
  CLEAR: '/user/clear',
  SAVE_CONTACTS: 'user/save-contacts',
  UPDATE_CONTACT: 'user/update-contact',
};

export const saveUser = (user: User) => ({
  type: ActionTypes.SAVE_USER,
  payload: user,
});

export const loginUser = () => ({
  type: ActionTypes.LOGIN_USER,
});

export const logoutUser = () => ({
  type: ActionTypes.LOGOUT_USER,
});

export const updateUser = (newProps: User) => ({
  type: ActionTypes.UPDATE_USER,
  payload: { ...newProps },
});

export const saveContacts = (users: User[]) => ({
  type: ActionTypes.SAVE_CONTACTS,
  payload: users,
});

export const updateContact = (contactId: string, newProps: User) => ({
  type: ActionTypes.UPDATE_CONTACT,
  payload: {
    contactId,
    props: { ...newProps },
  },
});

export const clear = () => ({
  type: ActionTypes.CLEAR,
});
