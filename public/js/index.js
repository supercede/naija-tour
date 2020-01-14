/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';

const mapDiv = document.getElementById('map');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.getElementById('signup-form');

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
