// src/components/PolicyManagement.jsx

import React, { useEffect, useState } from 'react';
import BlockchainService from '../services/BlockchainServices';

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    const fetchPolicies = async () => {
      const data = await BlockchainService.getPolicies();
      setPolicies(data);
    };
    fetchPolicies();
  }, []);

  return (
    <div className="policy-management">
      <h2>Policy Management</h2>
      <table>
        <thead><tr><th>Policy ID</th><th>Type</th><th>Status</th></tr></thead>
        <tbody>
          {policies.map(policy => (
            <tr key={policy.id}>
              <td>{policy.id}</td><td>{policy.type}</td><td>{policy.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PolicyManagement;
