/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:5000/api/v1/users/forgotPassword`,
      data: {
        email
      }
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Reset link sent to Email address');
    }
  } catch (err) {
    console.log(err);
    console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm) => {
  const token = window.location.pathname.split('/')[2];
  const url = `http://127.0.0.1:5000/api/v1/users/resetPassword/${token}`;
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        password,
        passwordConfirm
      }
    });
    console.log(url);
    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
