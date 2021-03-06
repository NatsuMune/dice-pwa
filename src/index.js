import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Fix scrollbar
const $body = document.querySelector('body');
let scrollPosition = window.pageYOffset;
$body.style.overflow = 'hidden';
$body.style.position = 'fixed';
$body.style.top = `-${scrollPosition}px`;
$body.style.width = '100%';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();