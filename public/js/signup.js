/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (email, password, name, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        email,
        password,
        name,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account created');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
