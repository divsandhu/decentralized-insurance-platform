import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Register';
import Dashboard from './components/Dashboard';
import PolicyPurchase from './components/PolicyPurchase';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/policy-purchase" element={<PolicyPurchase />} />
        <Route path="/policy-purchase" element={PolicyPurchase} />
      </Routes>

    </Router>
  );
}

export default App;
