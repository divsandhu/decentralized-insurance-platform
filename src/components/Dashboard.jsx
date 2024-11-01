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

  // Memoize loadDashboardData to prevent unnecessary recreations
  const loadDashboardData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    
    try {
      // Load policies
      const policyCount = await BlockchainService.contract.methods.policyCounter().call();
      const policyPromises = [];
      for (let i = 0; i < policyCount; i++) {
        policyPromises.push(BlockchainService.getPolicyDetails(i));
      }
      const loadedPolicies = await Promise.all(policyPromises);
      setPolicies(loadedPolicies);

      // Load claims
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
        
        // Subscribe to contract events
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

    // Subscribe to PolicyCreated events
    BlockchainService.contract.events.PolicyCreated({})
      .on('data', async (event) => {
        console.log('New policy created:', event);
        await loadDashboardData();
      })
      .on('error', console.error);

    // Subscribe to ClaimSubmitted events
    BlockchainService.contract.events.ClaimSubmitted({})
      .on('data', async (event) => {
        console.log('New claim submitted:', event);
        await loadDashboardData();
      })
      .on('error', console.error);

    // Subscribe to ClaimProcessed events
    BlockchainService.contract.events.ClaimProcessed({})
      .on('data', async (event) => {
        console.log('Claim processed:', event);
        await loadDashboardData();
      })
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
  

  const handleManualRefresh = async () => {
    await loadDashboardData();
  };

  const handleLogout = () => {
    // Clear any stored state or session data
    setIsConnected(false);
    setPolicies([]);
    setClaims([]);
    // Navigate to home
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
              <p className="text-3xl font-bold">
                {claims.filter(claim => !claim.processed).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Total Value Locked</h3>
              <p className="text-3xl font-bold">
                {policies.reduce((sum, policy) => sum + Number(policy.premium), 0).toFixed(4)} ETH
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              {claims.length === 0 ? (
                <div className="text-gray-500 text-center py-4">No claims yet</div>
              ) : (
                <div className="space-y-4">
                  {claims.slice(0, 5).map((claim, index) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Claim #{claim.id}</p>
                        <p className="text-sm text-gray-500">
                          Policy #{claim.policyId} - {claim.processed ? 'Processed' : 'Pending'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${
                        claim.processed 
                          ? claim.approved 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {claim.processed 
                          ? claim.approved 
                            ? 'Approved'
                            : 'Rejected'
                          : 'Pending'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;