// // i18n
import './locales/i18n'

// scroll bar
import 'simplebar/src/simplebar.css'

// editor
import 'react-quill/dist/quill.snow.css'

// slick-carousel
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
// @mui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
// components
import ScrollToTop from './components/scroll-to-top'

import { AuthProvider } from './auth/JwtContext'

import App from './App'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <BrowserRouter>
            <ScrollToTop />
            <App />
          </BrowserRouter>
        </LocalizationProvider>
      </HelmetProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
