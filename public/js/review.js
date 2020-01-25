/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteReview = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:5000/api/v1/reviews/${id}`
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Review Deleted');
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
