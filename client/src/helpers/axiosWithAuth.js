import axios from 'axios';

function axiosWithAuth() {
  const key = process.env.REACT_APP_API_KEY;

  if (!key) {
    throw Error('Missing API_KEY for axiosWithAuth helper.')
  }

  const client = axios.create({
    headers: { Authorization: `Token ${key}` }
  });

  return client;
}

export default axiosWithAuth;
