import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center">
      <div className="text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">
          Welcome to the Decentralized Insurance Platform
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Policies</h2>
            <Link to="/policy-management">
              <button className="bg-blue-700 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-800 transition-colors">
                Buy Insurance
              </button>
            </Link>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Claims</h2>
            <Link to="/claims-management">
              <button className="bg-red-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-700 transition-colors">
                File a Claim
              </button>
            </Link>
          </div>
          <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-4">Activity</h2>
            <Link to="/dashboard">
              <button className="bg-green-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-green-700 transition-colors">
                View Activity
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
