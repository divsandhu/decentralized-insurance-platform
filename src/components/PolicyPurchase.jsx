import React, { useState } from 'react';

const PolicyPurchase = () => {
  const [policyType, setPolicyType] = useState('');
  const [policyDetails, setPolicyDetails] = useState('');

  const handlePurchase = () => {
    // Implement the purchase logic here
    console.log('Policy purchased:', { policyType, policyDetails });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-8">Purchase a New Policy</h2>
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Policy Type</label>
            <input
              type="text"
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Policy Details</label>
            <textarea
              value={policyDetails}
              onChange={(e) => setPolicyDetails(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handlePurchase}
            className="bg-green-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-700 transition-colors"
          >
            Purchase Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyPurchase;
