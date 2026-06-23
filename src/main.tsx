import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
  window.location.replace(`/admin/index.html${window.location.search}${window.location.hash}`);
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
