/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/forgotPassword`,
      data: {
        email
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Reset link sent to Email address');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (password, passwordConfirm) => {
  const token = window.location.pathname.split('/')[2];
  const url = `/api/v1/users/resetPassword/${token}`;
  try {
    const res = await axios({
      method: 'PATCH',
      url,
      data: {
        password,
        passwordConfirm
      }
    });
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
