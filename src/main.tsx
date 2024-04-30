import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import axios from 'axios';

const container = document.getElementById('root');
const root = createRoot(container!);

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);