import axios from 'axios';

export function getUser(userId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<User>((resolve, reject) => {
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
        .catch(() => {
          console.error(`Failed to load the user ${userId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function getAllUsers() {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<User[]>((resolve, reject) => {
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
        .catch(() => {
          console.error(`Failed to load the users`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function updateUser(userId: string, userNewProps: User) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
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
        .catch(() => {
          console.error(`Failed to update user ${userId}`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function updateProfilePicture(userId: string, picture: File) {
  const token = localStorage.getItem('token');
  if (token && picture) {
    return new Promise<string>((resolve, reject) => {
      let formData = new FormData();
      formData.append('image', picture);

      axios
        .put(
          `${axios.defaults.baseURL}/user/updateProfilePicture/${userId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(`Update the profile picture`);
            resolve(res.data.pictureUrl);
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          console.log(
            `Failed to update the profile picture for the user ${userId}`
          );
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}

export function loginUser(username: string, password: string, phone: string) {
  return new Promise<{ userId: string; token: string }>((resolve, reject) => {
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
      .catch(() => {
        console.error(`Failed to login`);
        reject();
      });
  });
}

export function logoutUser(userId: string) {
  const token = localStorage.getItem('token');
  if (token) {
    return new Promise<void>((resolve, reject) => {
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
        .catch(() => {
          console.error(`Failed to logout`);
          reject();
        });
    });
  } else {
    console.error(`No token found`);
    return Promise.reject();
  }
}
