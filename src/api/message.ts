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
  }
}

export function getMessage(msgId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Message[]>((resolve) => {
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
        .catch(() =>
          console.error(`Failed to get the data of message ${msgId}`)
        );
    });
  } else {
    console.error(`No token found`);
  }
}

export function getMessagesOnChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<Message[]>((resolve) => {
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
        .catch(() =>
          console.error(`failed to load the messages on chat ${chatId}`)
        );
    });
  } else {
    console.error(`No token found`);
  }
}

export function createMessage(props: Message) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
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
        .catch(() => console.error(`Failed to create a message`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function deleteMessage(msgId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
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
        .catch(() => console.error(`Failed to delete the message ${msgId}`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function deleteMessagesOnChat(chatId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
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
        .catch(() =>
          console.error(`Failed to delete the messages of chat ${chatId}`)
        );
    });
  } else {
    console.error(`No token found`);
  }
}

export function updateMessage(msgId: string, newProps: Message) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
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
        .catch(() => console.error(`Failed to update the message ${msgId}`));
    });
  } else {
    console.error(`No token found`);
  }
}
