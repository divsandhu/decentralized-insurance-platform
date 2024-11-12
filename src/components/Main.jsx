// src/components/Main.jsx

import React, { useState } from 'react';
import Dashboard from './Dashboard';
import PolicyPurchase from './PolicyPurchase';

const Main = () => {
  const [policies, setPolicies] = useState([]);

  const addNewPolicy = (newPolicy) => {
    setPolicies((prevPolicies) => [...prevPolicies, newPolicy]);
  };

  return (
    <div>
      <Dashboard policies={policies} />
      <PolicyPurchase onPolicyPurchase={addNewPolicy} />
    </div>
  );
};

export default Main;
