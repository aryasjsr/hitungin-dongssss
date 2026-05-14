import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#252535',
          color: '#f1f1f5',
          borderRadius: '10px',
          border: '1px solid #2e2e3e',
          fontSize: '14px',
        },
        success: {
          style: {
            background: 'rgba(34, 197, 94, 0.15)',
            borderLeft: '3px solid #22c55e',
          },
        },
        error: {
          style: {
            background: 'rgba(239, 68, 68, 0.15)',
            borderLeft: '3px solid #ef4444',
          },
        },
      }}
    />
  </React.StrictMode>
);
