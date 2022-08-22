import React from 'react';
import ReactDOM from 'react-dom/client';
import 'remixicon/fonts/remixicon.css';
import './index.css';
import App from './App';
import {ExtensionContextProvider} from './components/extensionContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ExtensionContextProvider>
        <App />
    </ExtensionContextProvider>
);