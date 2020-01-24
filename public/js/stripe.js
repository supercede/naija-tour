/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourID => {
  const stripe = Stripe('pk_test_pGmHBeZLBSMcpztmKTkV5Fi200tzlZOPPX');
  try {
    // Get checkout session from server
    const res = await axios(
      `http://127.0.0.1:5000/api/v1/bookings/checkout-session/${tourID}`
    );
    // Create checkout form plus charge credit card with stripe object
    await stripe.redirectToCheckout({
      sessionId: res.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
