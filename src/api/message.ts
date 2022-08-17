import axios from 'axios';

export function getAllMessages() {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Message[]>((resolve) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/message`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Load all the messages data`);
            resolve(res.data.messages);
          } else {
            throw new Error();
          }
        })
        .catch(() => console.error(`Failed to get all the messages data`));
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function getMessage(msgId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Message[]>((resolve, reject) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/message/${msgId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Load the data of message ${msgId}`);
            resolve(res.data.message);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to get the data of message ${msgId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function getMessagesOnChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Message[]>((resolve, reject) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/message/chat/${chatId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Load all the messages on chat ${chatId}`);
            resolve(res.data.messages);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`failed to load the messages on chat ${chatId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function createMessage(props: Message) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/message/create`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: { ...props },
      })
        .then((res) => {
          if (res.status === 201) {
            console.log('Send message');
            resolve();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to create a message`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function deleteMessage(msgId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: 'delete',
        url: `${axios.defaults.baseURL}/message/delete/${msgId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            resolve();
            console.log(`Message ${msgId} deleted`);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to delete the message ${msgId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function deleteMessagesOnChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: 'delete',
        url: `${axios.defaults.baseURL}/deleteOnChat/${chatId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Messages of the chat ${chatId} deleted`);
            resolve();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to delete the messages of chat ${chatId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function updateMessage(msgId: string, newProps: Message) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/message/update/${msgId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: { ...newProps },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`update the message ${msgId}`);
            resolve();
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.error(`Failed to update the message ${msgId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}
