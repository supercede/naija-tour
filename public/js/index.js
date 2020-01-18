/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout } from './login';
import { signup } from './signup';
import { updateProfile } from './updateSettings';
import { displayMap } from './mapbox';
import { forgotPassword, resetPassword } from './password';

const mapDiv = document.getElementById('map');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.getElementById('signup-form');
const updateProfileForm = document.getElementById('edit-profile-form');
const updatePasswordForm = document.getElementById('edit-password-form');
const forgotPasswordForm = document.getElementById('password-form');
const resetPasswordForm = document.getElementById('reset-form');

if (mapDiv) {
  const locations = JSON.parse(mapDiv.dataset.location);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
    e.preventDefault();
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const errMessage = document.querySelector('.password-error');

    if (password !== passwordConfirm) {
      errMessage.textContent = `*passwords do not match`;
    } else {
      errMessage.textContent = '';
      signup(email, password, name, passwordConfirm);
    }
    e.preventDefault();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateProfileForm) {
  updateProfileForm.addEventListener('submit', e => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = document.getElementById('photo').files[0];

    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('photo', photo);

    updateProfile(form, 'data');
    e.preventDefault();
  });
}

if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', e => {
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const errMessage = document.querySelector('.password-error');

    if (password !== passwordConfirm) {
      errMessage.textContent = `*passwords do not match`;
    } else {
      errMessage.textContent = '';
      updateProfile(
        { currentPassword, password, passwordConfirm },
        'password'
      ).then(() => {
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
        document.querySelector('.btn--save-password').textContent =
          'Save Password';
      });
    }
    e.preventDefault();
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const btnValue = document.querySelector('.btn--green');
    btnValue.textContent = 'Sending...';
    const email = document.getElementById('email').value;
    await forgotPassword(email);
    btnValue.textContent = 'Send Email';
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const errMessage = document.querySelector('.password-error');
    if (password !== passwordConfirm) {
      errMessage.textContent = `*passwords do not match`;
    } else {
      console.log('Hi work');
      errMessage.textContent = ``;
      await resetPassword(password, passwordConfirm);
    }
  });
}
