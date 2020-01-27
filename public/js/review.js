/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteReview = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${id}`
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Review Deleted');
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const createReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        rating,
        review
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your Review has been created');
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
