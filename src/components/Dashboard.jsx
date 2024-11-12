import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import BlockchainService from '../services/BlockchainServices';
import { 
  FaChartLine, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaFileInvoice, 
  FaHandHoldingUsd, 
  FaList, 
  FaHeadset,
  FaExclamationCircle,
  FaSync
} from 'react-icons/fa';

const Dashboard = () => {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const policyCount = await BlockchainService.contract.methods.policyCounter().call();
      const policyPromises = [];
      for (let i = 0; i < policyCount; i++) {
        policyPromises.push(BlockchainService.getPolicyDetails(i));
      }
      const loadedPolicies = await Promise.all(policyPromises);
      setPolicies(loadedPolicies);

      const claimCount = await BlockchainService.contract.methods.claimCounter().call();
      const claimPromises = [];
      for (let i = 0; i < claimCount; i++) {
        claimPromises.push(BlockchainService.getClaimDetails(i));
      }
      const loadedClaims = await Promise.all(claimPromises);
      setClaims(loadedClaims);
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
      console.error('Dashboard data loading error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const initializeBlockchain = useCallback(async () => {
    try {
      const connected = await BlockchainService.initialize();
      setIsConnected(connected);
      if (connected) {
        await loadDashboardData();
        subscribeToContractEvents();
      }
    } catch (err) {
      setError('Failed to connect to blockchain: ' + err.message);
      console.error('Blockchain initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadDashboardData]);

  const subscribeToContractEvents = () => {
    if (!BlockchainService.contract) return;

    BlockchainService.contract.events.PolicyCreated({})
      .on('data', async () => await loadDashboardData())
      .on('error', console.error);

    BlockchainService.contract.events.ClaimSubmitted({})
      .on('data', async () => await loadDashboardData())
      .on('error', console.error);

    BlockchainService.contract.events.ClaimProcessed({})
      .on('data', async () => await loadDashboardData())
      .on('error', console.error);
  };

  useEffect(() => {
    initializeBlockchain();

    if (location.state?.refreshData) {
      loadDashboardData().then(() => {
        navigate(location.pathname, { replace: true, state: {} });
      });
    }

    return () => {
      if (BlockchainService.contract) {
        BlockchainService.contract.events.PolicyCreated({}).unsubscribe();
        BlockchainService.contract.events.ClaimSubmitted({}).unsubscribe();
        BlockchainService.contract.events.ClaimProcessed({}).unsubscribe();
      }
    };
  }, [initializeBlockchain, loadDashboardData, location, navigate]);

  const handleManualRefresh = async () => await loadDashboardData();

  const handleLogout = () => {
    setIsConnected(false);
    setPolicies([]);
    setClaims([]);
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <FaExclamationCircle className="text-4xl text-red-500 mx-auto" />
          <div className="text-xl">Please connect your wallet to continue</div>
          <button 
            onClick={initializeBlockchain}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

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
              <Link to="/dashboard" className="flex items-center p-4 bg-gray-700">
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
                <span>Purchase Policy</span>
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
                <span>Support</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center p-4 w-full text-left hover:bg-gray-700"
              >
                <FaSignOutAlt className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className={`p-2 rounded-full hover:bg-gray-100 ${isRefreshing ? 'animate-spin' : ''}`}
                title="Refresh data"
              >
                <FaSync className="text-gray-600" />
              </button>
              <span className="text-sm">Connected: {BlockchainService.account}</span>
              <FaUserCircle className="text-2xl text-gray-600" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Policies</h3>
              <p className="text-3xl font-bold">{policies.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Active Claims</h3>
              <p className="text-3xl font-bold">{claims.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Policyholders</h3>
              <p className="text-3xl font-bold">{/* Replace with dynamic count */}</p>
            </div>
          </div>

          {/* Policies Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-lg font-semibold text-gray-800 p-6 border-b">Policies</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Policy ID</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Type</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, index) => (
                  <tr key={index} className="bg-white">
                    <td className="py-4 px-6 text-sm text-gray-900">{policy.policyId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{policy.policyType}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{policy.premiumAmount} ETH</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{policy.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Claims Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <h2 className="text-lg font-semibold text-gray-800 p-6 border-b">Claims</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Policy ID</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr key={index} className="bg-white">
                    <td className="py-4 px-6 text-sm text-gray-900">{claim.claimId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{claim.policyId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{claim.amount} ETH</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{claim.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
