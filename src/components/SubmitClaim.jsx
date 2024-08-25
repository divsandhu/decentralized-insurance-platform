import React, { useState } from 'react';

const SubmitClaim = () => {
  const [claimType, setClaimType] = useState('');
  const [claimDetails, setClaimDetails] = useState('');

  const handleClaimSubmit = () => {
    // Implement the claim submission logic here
    console.log('Claim submitted:', { claimType, claimDetails });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-8">Submit a New Claim</h2>
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Claim Type</label>
            <input
              type="text"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Claim Details</label>
            <textarea
              value={claimDetails}
              onChange={(e) => setClaimDetails(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleClaimSubmit}
            className="bg-red-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-700 transition-colors"
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitClaim;
