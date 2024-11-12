import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import PolicyManagement from './components/PolicyManagement';
import PolicyPurchase from './components/PolicyPurchase';
import ClaimsManagement from './components/ClaimsManagement';
import Support from './components/ContactSupport';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/policy-management" element={<PolicyManagement />} />
        <Route path="/policy-purchase" element={<PolicyPurchase />} />
        <Route path="/claims-management" element={<ClaimsManagement />} />
        <Route path="/contact-support" element={<Support />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
