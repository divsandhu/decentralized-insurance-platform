import React from 'react';
import { Link } from 'react-router-dom';

const ClaimsManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-8">Claims Management</h2>
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">Your Claims</h3>
          {/* Replace this section with dynamic claim data */}
          <ul>
            <li>Claim #12345 - Pending</li>
            <li>Claim #67890 - Approved</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Link to="/submit-claim">
            <button className="bg-red-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-700 transition-colors">
              Submit a New Claim
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClaimsManagement;
