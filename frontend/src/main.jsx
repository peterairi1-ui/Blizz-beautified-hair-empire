import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (import.meta.env && import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => {
        console.log('Service worker registered:', reg.scope);

        if (reg.waiting) {
          console.log('Service worker waiting - update available');
          try { localStorage.setItem('bbhe-sw-waiting', '1'); } catch {}
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
                try { localStorage.setItem('bbhe-sw-waiting', '1'); } catch {}
              } else {
                console.log('Content is cached for offline use.');
              }
            }
          });
        });
      })
      .catch((err) => console.warn('Service worker registration failed:', err));
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service worker controller changed.');
    try { localStorage.removeItem('bbhe-sw-waiting'); } catch {}
  });
} else {
  console.log('Service worker registration skipped (not production)');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
