import axios from 'axios';

export function getUser(userId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<User>((resolve) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/user/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`User ${res.data.user._id} loaded`);
            resolve(res.data.user);
          } else {
            throw new Error();
          }
        })
        .catch(() => console.error(`Failed to load the user ${userId}`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function getAllUsers() {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<User[]>((resolve) => {
      axios({
        method: 'get',
        url: `${axios.defaults.baseURL}/user`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`All users has been loaded`);
            resolve(res.data.users);
          } else {
            throw new Error();
          }
        })
        .catch(() => console.error(`Failed to load the users`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function updateUser(userId: string, userNewProps: User) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/user/update/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          ...userNewProps,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            resolve();
            console.log(`Update user ${userId}`);
          } else {
            throw new Error();
          }
        })
        .catch(() => console.error(`Failed to update user ${userId}`));
    });
  } else {
    console.error(`No token found`);
  }
}

export function loginUser(username: string, password: string, phone: string) {
  return new Promise<{ userId: string; token: string }>((resolve) => {
    axios({
      method: 'post',
      url: `${axios.defaults.baseURL}/user/login`,
      data: {
        password: 'password',
        username: username,
        phone: phone,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`Login successfully`);
          resolve({ userId: res.data.userId, token: res.data.token });
        } else {
          throw new Error();
        }
      })
      .catch(() => console.error(`Failed to login`));
  });
}

export function logoutUser(userId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve) => {
      axios({
        method: 'post',
        url: `${axios.defaults.baseURL}/user/logout/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            console.log(`Logout successfully`);
            resolve();
          } else {
            throw new Error();
          }
        })
        .catch(() => console.error(`Failed to logout`));
    });
  } else {
    console.error(`No token found`);
  }
}
