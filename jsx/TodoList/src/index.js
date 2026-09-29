import React from 'react';
import { StrictMode } from 'react';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);
