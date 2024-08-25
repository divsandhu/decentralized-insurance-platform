import React from 'react';
import { Link } from 'react-router-dom';

const PolicyManagement = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-8">Policy Management</h2>
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">Your Policies</h3>
          {/* Replace this section with dynamic policy data */}
          <ul>
            <li>Policy #12345 - Active</li>
            <li>Policy #67890 - Expired</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Link to="/policy-purchase">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-700 transition-colors">
              Purchase New Policy
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PolicyManagement;
