import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App';
import SignInUp from './routes/SignInUp';
import SignIn from './routes/SignIn';
import Blog from './routes/Blog';
import AuthError from './routes/AuthError';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sign-in-up" element={<SignInUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/auth-error" element={<AuthError />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)