import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import { SocketProvider } from './SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  // </StrictMode>,
)
