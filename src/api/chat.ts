import axios from 'axios';

export function getChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat>((resolve) => {
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
        .catch(() => console.error(`Failed to load the chat ${chatId}`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function getAllChats() {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat[]>((resolve) => {
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
        .catch(() => console.error(`Failed to load all the chats`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function getChatsOfUser(userId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat[]>((resolve) => {
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
        .catch(() =>
          console.error(`Failed to load the chats for user ${userId}`)
        );
    });
  } else {
    console.error(`No token found`);
  }
}

export function createChat(props: Chat) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Chat>((resolve) => {
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
        .catch(() => console.error(`Failed to create the chat`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function deleteChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
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
        .catch(() => console.error(`Failed to delete the chat ${chatId}`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function updateChat(chatId: string, newProps: Chat) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
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
        .catch(() => console.error(`Failed to delete the chat ${chatId}`));
    });
  } else {
    console.error(`No token found`);
  }
}
