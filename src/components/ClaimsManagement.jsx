// src/components/ClaimsManagement.jsx

import React, { useState, useEffect } from 'react';
import BlockchainService from '../services/BlockchainServices';

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [newClaim, setNewClaim] = useState({ policyId: '', amount: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      const data = await BlockchainService.getClaims();
      setClaims(data);
    };
    fetchClaims();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await BlockchainService.fileClaim(newClaim);
      setClaims([...claims, newClaim]);
    } catch (err) {
      setError('Failed to file claim: ' + err.message);
    }
  };

  return (
    <div className="claims-management">
      <h2>File a Claim</h2>
      <form onSubmit={handleSubmit}>
        <label>Policy ID</label>
        <input
          type="text"
          value={newClaim.policyId}
          onChange={(e) => setNewClaim({ ...newClaim, policyId: e.target.value })}
        />

        <label>Amount</label>
        <input
          type="text"
          value={newClaim.amount}
          onChange={(e) => setNewClaim({ ...newClaim, amount: e.target.value })}
        />

        <label>Description</label>
        <textarea
          value={newClaim.description}
          onChange={(e) => setNewClaim({ ...newClaim, description: e.target.value })}
        />

        <button type="submit">Submit Claim</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default ClaimsManagement;
