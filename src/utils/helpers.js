import { EXPIRATION_DAYS } from '../database/constants.js';

export function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) === 1 ? '' : 's'} ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) === 1 ? '' : 's'} ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function isExpired(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const days = (now - date) / (1000 * 60 * 60 * 24);
  return days > EXPIRATION_DAYS;
}

export function daysUntilExpiration(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const days = (now - date) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.ceil(EXPIRATION_DAYS - days));
}

export function getPrivateLink(token) {
  const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  return `${base}private.html?token=${token}`;
}

export function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomLightYears() {
  return (Math.random() * 9000 + 1000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function copyToClipboard(text) {
  return navigator.clipboard?.writeText(text) || Promise.reject();
}
