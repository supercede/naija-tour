/* eslint-disable */
import axios from 'axios';
import { showAlert, hideAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
    console.log(res);
  } catch (err) {
    hideAlert('error', err.response.data.message);
  }
};
