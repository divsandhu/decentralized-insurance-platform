import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockchainService from '../services/BlockchainServices';

const PolicyPurchase = () => {  // Removed the onPolicyPurchase prop
  const [formData, setFormData] = useState({
    premium: '0.00001',
    duration: '1',
    coverage: '2456',
    policyType: 'Basic Policy',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initBlockchain = async () => {
      const success = await BlockchainService.initialize();
      setInitialized(success);
      if (!success) setError('Blockchain service not initialized. Please check MetaMask.');
    };
    initBlockchain();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePurchasePolicy = async () => {
    if (!initialized) {
      setError('Blockchain service not initialized');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await BlockchainService.createPolicy(
        formData.premium,
        BlockchainService.web3.utils.toWei(formData.coverage, 'ether'),
        parseInt(formData.duration),
        formData.policyType
      );

      await BlockchainService.web3.eth.getTransactionReceipt(result.transactionHash);
      setTransactionHash(result.transactionHash);

      // Navigate to Dashboard with refresh flag
      navigate('/dashboard', { 
        state: { 
          refreshData: true, 
          transactionHash: result.transactionHash 
        } 
      });
    } catch (err) {
      setError(err.message || 'Failed to purchase policy');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Purchase Policy</h1>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Premium (ETH)</label>
              <input
                type="number"
                name="premium"
                value={formData.premium}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.00001"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (Days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Coverage Amount (ETH)</label>
            <input
              type="number"
              name="coverage"
              value={formData.coverage}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Policy Type</label>
            <select
              name="policyType"
              value={formData.policyType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Basic Policy">Basic Policy</option>
              <option value="Premium Policy">Premium Policy</option>
              <option value="Enterprise Policy">Enterprise Policy</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center">
              <p>{error}</p>
            </div>
          )}

          {transactionHash && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 flex items-center">
              <p>Policy created! Transaction Hash: {transactionHash.slice(0, 10)}...</p>
            </div>
          )}

          <button
            onClick={handlePurchasePolicy}
            disabled={isProcessing}
            className={`w-full py-3 px-4 text-white bg-blue-600 rounded-lg font-medium
              ${isProcessing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              'Purchase Policy'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyPurchase;
