import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Cadastro from './Cadastro.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Dashboard from './Dashboard.jsx'

if('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
    .then(() => console.log('SW registrado'))
    .catch(err => console.error('SW erro', err))
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PrivateRoute><App /></PrivateRoute>}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/cadastro' element={<Cadastro />}></Route>
          <Route path='/dashboard' element={<Dashboard></Dashboard>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)