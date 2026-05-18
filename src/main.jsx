import 'leaflet/dist/leaflet.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHead, UnheadProvider } from '@unhead/react/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'

const head = createHead();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UnheadProvider head={head}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UnheadProvider>
  </React.StrictMode>,
)

