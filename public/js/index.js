/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { login, logout } from './login';
import { displayMap } from './mapbox';

const mapDiv = document.getElementById('map');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapDiv) {
  const locations = JSON.parse(mapDiv.dataset.location);

  displayMap(locations);
}

if (loginForm) {
  console.log('Loggg');
  loginForm.addEventListener('submit', e => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
    e.preventDefault();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
