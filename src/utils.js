export const getApiToken = () =>
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_API_KEY
    : process.env.REACT_APP_SANDBOX_API_KEY;

export const getApiURL = () => process.env.REACT_APP_API_URL;

export const getSocketURL = () => process.env.REACT_APP_SOCKET_URL;
