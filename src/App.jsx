import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import PolicyManagement from './components/PolicyManagement';
import PolicyPurchase from './components/PolicyPurchase';
import ClaimsManagement from './components/ClaimsManagement';
import SubmitClaim from './components/SubmitClaim';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/policy-management" element={<PolicyManagement />} />
        <Route path="/policy-purchase" element={<PolicyPurchase />} />
        <Route path="/claims-management" element={<ClaimsManagement />} />
        <Route path="/submit-claim" element={<SubmitClaim />} />
      </Routes>
    </Router>
  );
};

export default App;
