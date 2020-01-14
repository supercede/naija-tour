/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateProfile = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:5000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:5000/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
      showAlert('success', `${capitalType} Updated Successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
