import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-8">Dashboard Overview</h2>
      <div className="w-full max-w-4xl mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-2xl font-semibold mb-4">Active Policies</h3>
          {/* Replace this section with dynamic policy data */}
          <p>You currently have 2 active policies.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Claim Status</h3>
          {/* Replace this section with dynamic claim data */}
          <p>You have 1 pending claim.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
