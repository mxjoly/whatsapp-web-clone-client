import axios from 'axios';

export function getChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat>((resolve, reject) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/chat/${chatId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Chat ${res.data.chat._id} loaded`);
            resolve(res.data.chat);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to load the chat ${chatId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function getAllChats() {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat[]>((resolve, reject) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/chat`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`All chats loaded`);
            resolve(res.data.chats);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to load all the chats`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function getChatsOfUser(userId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat[]>((resolve, reject) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/chat/user/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Chats for the user ${userId} successfully loaded`);
            resolve(res.data.chats);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to load the chats for user ${userId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function createChat(props: Chat) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat>((resolve, reject) => {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/chat/create`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 201) {
            console.log(`Chat created successfully`);
            resolve(res.data.chat);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to create the chat`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function deleteChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: 'delete',
        url: `${axios.defaults.baseURL}/chat/delete/${chatId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Chat ${chatId} deleted successfully`);
            resolve();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to delete the chat ${chatId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function updateChat(chatId: string, newProps: Chat) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/chat/update/${chatId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { ...newProps },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Chat ${chatId} deleted successfully`);
            resolve();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to delete the chat ${chatId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}
