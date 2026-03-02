import React from 'react'
import ReactDOM from 'react-dom/client'
import 'remixicon/fonts/remixicon.css'
import './index.css'
import App from './App'
import { ExtensionContextProvider } from './components/extensionContext'
import { loadConfig } from './config'

loadConfig().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ExtensionContextProvider>
        <App />
      </ExtensionContextProvider>
    </React.StrictMode>
  )
})
