import React from 'react';
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={clerkKey}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/register/*" element={<Register />} />
          <Route path="/forgot-password/*" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
