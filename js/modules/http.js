// export const API_URL = "http://localhost:5001/api";
export const API_URL = "https://news-parser-7h6m.onrender.com/api";

const $api = axios.create({
  withCredentials: false,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        let refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${API_URL}/refresh`, {
          refreshToken,
        });
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (e) {
        console.log(e.response?.data?.message);
      }
    }
    throw error;
  }
);

export async function registration(email, password) {
  let loginData = {
    email: email,
    password: password,
  };
  try {
    let response = await $api.post("/registration", loginData);
    if (response.status == 200 || response.statusText == "OK") {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return await response;
  } catch (error) {
    return await error.response;
  }
}
export async function login(email, password) {
  let loginData = {
    email: email,
    password: password,
  };

  try {
    let response = await $api.post("/login", loginData);
    if (response.status == 200 || response.statusText == "OK") {
      localStorage.setItem("token", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }
    return await response;
  } catch (error) {
    return await error.response;
  }
}

export async function checkAuth() {
  try {
    let refreshToken = localStorage.getItem("refreshToken");
    const response = await $api.post(`${API_URL}/refresh`, { refreshToken });
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return await response;
  } catch (e) {
    console.log(e.response?.data?.message);
    return e.response;
  } finally {
  }
}

export async function changeServiceStatus(serviceStatus) {
  try {
    const response = await $api.post(`${API_URL}/service-status`, {
      serviceStatus,
    });

    return await response;
  } catch (e) {
    return e.response;
  } finally {
  }
}

export async function getServiceStatus() {
  try {
    const response = await $api.get(`${API_URL}/service-status`);

    return await response;
  } catch (e) {
    return e.response;
  } finally {
  }
}

// groups

export async function addNewGroup(name, chatId) {
  try {
    const response = await $api.post(`${API_URL}/group/add`, { name, chatId });
    return await response;
  } catch (e) {
    return e.response;
  } finally {
  }
}

export async function getAllGroups() {
  try {
    const response = await $api.get(`${API_URL}/groups`);
    return await response;
  } catch (e) {
    return e.response;
  } finally {
  }
}

export async function deleteGroup(groupId) {
  try {
    const response = await $api.post(`${API_URL}/group/delete`, {
      groupId: groupId,
    });
    return await response;
  } catch (e) {
    return e.response;
  } finally {
  }
}
export async function changeGroupStatus(groupId) {
  try {
    const response = await $api.post(`${API_URL}/group/change-status`, {
      groupId: groupId,
    });
    return await response;
  } catch (e) {
    return e.response;
  } finally {
  }
}
