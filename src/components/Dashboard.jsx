import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaUserCircle, FaCog, FaSignOutAlt, FaFileInvoice, FaHandHoldingUsd, FaList, FaHeadset } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          <Link to="/dashboard">DecentraSure</Link>
        </div>
        <nav className="flex-1 mt-6">
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard" className="flex items-center p-4 hover:bg-gray-700">
                <FaChartLine className="mr-3" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/policy-management" className="flex items-center p-4 hover:bg-gray-700">
                <FaList className="mr-3" />
                <span>Policy Management</span>
              </Link>
            </li>
            <li>
              <Link to="/policy-purchase" className="flex items-center p-4 hover:bg-gray-700">
                <FaHandHoldingUsd className="mr-3" />
                <span>Policy Purchase</span>
              </Link>
            </li>
            <li>
              <Link to="/claims-management" className="flex items-center p-4 hover:bg-gray-700">
                <FaFileInvoice className="mr-3" />
                <span>Claims Management</span>
              </Link>
            </li>
            <li>
              <Link to="/contact-support" className="flex items-center p-4 hover:bg-gray-700">
                <FaHeadset className="mr-3" />
                <span>Contact Support</span>
              </Link>
            </li>
            <li>
              <button className="flex items-center p-4 w-full text-left hover:bg-gray-700">
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, User</span>
            <img 
              src="https://via.placeholder.com/40" 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full border border-gray-600"
            />
          </div>
        </header>

        {/* Main Dashboard Sections */}
        <div className="p-6 flex-1 space-y-6">
          {/* Metrics Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Total Policies</h2>
              <p className="text-3xl font-bold">123</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Active Claims</h2>
              <p className="text-3xl font-bold">45</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Upcoming Renewals</h2>
              <p className="text-3xl font-bold">12</p>
            </div>
          </section>

          {/* Dashboard Sections */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/policy-management" className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 flex items-center">
                <FaList className="text-2xl mr-3" />
                <span>Manage Policies</span>
              </Link>
              <Link to="/policy-purchase" className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600 flex items-center">
                <FaHandHoldingUsd className="text-2xl mr-3" />
                <span>Purchase Policy</span>
              </Link>
              <Link to="/claims-management" className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600 flex items-center">
                <FaFileInvoice className="text-2xl mr-3" />
                <span>Manage Claims</span>
              </Link>
              <Link to="/contact-support" className="bg-red-500 text-white p-4 rounded-lg shadow-md hover:bg-red-600 flex items-center">
                <FaHeadset className="text-2xl mr-3" />
                <span>Contact Support</span>
              </Link>
            </div>
          </section>

          {/* Recent Activities */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700">Policy #001 issued</span>
                <span className="text-gray-500 text-sm">2 hours ago</span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-700">Claim #123 processed</span>
                <span className="text-gray-500 text-sm">1 day ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Policy #002 renewed</span>
                <span className="text-gray-500 text-sm">3 days ago</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
