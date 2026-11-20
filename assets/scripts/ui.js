// ui.js — spinner e alert

import { spinner, alertContainer } from './dom.js';

export function showSpinner() {
  spinner.classList.remove('d-none');
}

export function hideSpinner() {
  spinner.classList.add('d-none');
}

export function showAlert(message) {
  clearAlert();
  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', 'alert-danger');
  alertDiv.setAttribute('role', 'alert');
  alertDiv.textContent = message;
  alertContainer.appendChild(alertDiv);
}

export function clearAlert() {
  alertContainer.textContent = '';
}