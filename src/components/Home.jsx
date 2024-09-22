import React from 'react';
import { Link } from 'react-router-dom';
import { FaLock, FaEye, FaRocket, FaCheckCircle, FaRegChartBar, FaUsers, FaDollarSign } from 'react-icons/fa'; // Importing additional icons

const Home = () => {
  return (
    <div className="text-white bg-gray-900 min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-gray-800 p-4 flex justify-between items-center">
        {/* Logo or Site Name */}
        <div className="text-2xl font-bold">
          <Link to="/" className="text-white">DecentraSure</Link>
        </div>

        {/* Login/Signup Buttons */}
        <div className="flex space-x-4">
          <Link to="/login">
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full text-sm">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-sm">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full bg-gradient-to-r from-gray-800 to-gray-900 py-20 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-400 mb-4">Welcome to DecentraSure</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">Decentralized Insurance for a Secure Future</p>
        <Link to="/signup">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full text-lg">
            Get Started
          </button>
        </Link>
      </header>

      {/* About Section */}
      <section className="w-full py-16 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">About DecentraSure</h2>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
          DecentraSure is a decentralized insurance platform providing transparent, secure, and efficient coverage through smart contracts. Our mission is to empower users with full control over their insurance needs.
        </p>
        <Link to="/about-us" className="mt-8 text-blue-500 font-semibold hover:underline">
          Learn More
        </Link>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-gray-800 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 max-w-6xl">
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaEye className="text-4xl text-blue-400 mb-4" /> {/* Icon for Transparency */}
            <h3 className="text-2xl font-semibold mb-4">Transparency</h3>
            <p className="text-gray-300 text-center">All transactions are recorded on the blockchain, ensuring complete transparency.</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaLock className="text-4xl text-green-400 mb-4" /> {/* Icon for Security */}
            <h3 className="text-2xl font-semibold mb-4">Security</h3>
            <p className="text-gray-300 text-center">Our platform uses smart contracts, providing a secure and reliable insurance experience.</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaRocket className="text-4xl text-red-400 mb-4" /> {/* Icon for Efficiency */}
            <h3 className="text-2xl font-semibold mb-4">Efficiency</h3>
            <p className="text-gray-300 text-center">Automated processes reduce the time and cost involved in managing insurance policies.</p>
          </div>
        </div>
      </section>

      {/* Success Metrics Section */}
      <section className="w-full py-16 bg-gray-900 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-400">Our Success Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 max-w-6xl">
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaCheckCircle className="text-4xl text-green-400 mb-4" /> {/* Icon for Successful Policies */}
            <h3 className="text-2xl font-semibold mb-2">1000+</h3>
            <p className="text-gray-300">Successful Policies Issued</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaRegChartBar className="text-4xl text-blue-400 mb-4" /> {/* Icon for Claims */}
            <h3 className="text-2xl font-semibold mb-2">500+</h3>
            <p className="text-gray-300">Claims Processed</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaUsers className="text-4xl text-yellow-400 mb-4" /> {/* Icon for Active Users */}
            <h3 className="text-2xl font-semibold mb-2">1200+</h3>
            <p className="text-gray-300">Active Users</p>
          </div>
          <div className="bg-gray-700 p-8 rounded-lg flex flex-col items-center">
            <FaDollarSign className="text-4xl text-green-300 mb-4" /> {/* Icon for Total Payouts */}
            <h3 className="text-2xl font-semibold mb-2">$500,000+</h3>
            <p className="text-gray-300">Total Payouts</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
