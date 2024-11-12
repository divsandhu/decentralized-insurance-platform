import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockchainService from '../services/BlockchainServices';

const SubmitClaim = () => {
  const [policies, setPolicies] = useState([]);
  const [formData, setFormData] = useState({
    policyId: '',
    amount: '',
    description: '',
    evidence: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserPolicies();
  }, []);

  const loadUserPolicies = async () => {
    try {
      const policyCount = await BlockchainService.contract.methods.policyCounter().call();
      const policyPromises = [];
      for (let i = 0; i < policyCount; i++) {
        const policy = await BlockchainService.getPolicyDetails(i);
        if (policy.owner === BlockchainService.account) {
          policyPromises.push(policy);
        }
      }
      const userPolicies = await Promise.all(policyPromises);
      setPolicies(userPolicies);
    } catch (err) {
      setError('Failed to load policies: ' + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await BlockchainService.contract.methods
        .submitClaim(
          formData.policyId,
          BlockchainService.web3.utils.toWei(formData.amount, 'ether'),
          formData.description
        )
        .send({ from: BlockchainService.account });
      navigate('/claims-management');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Submit a Claim</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Policy
            </label>
            <select
              name="policyId"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.policyId}
              onChange={handleChange}
            >
              <option value="">Select a policy</option>
              {policies.map((policy) => (
                <option key={policy.policyId} value={policy.policyId}>
                  Policy #{policy.policyId} - {policy.policyType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Claim Amount (ETH)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supporting Evidence
            </label>
            <input
              type="file"
              name="evidence"
              className="mt-1 block w-full"
              onChange={(e) => setFormData({
                ...formData,
                evidence: e.target.files[0]
              })}
            />
            <p className="mt-1 text-sm text-gray-500">
              Upload any relevant documents or images
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? 'Submitting...' : 'Submit Claim'}
          </button>
        </form>
      </div>
    </div>
  );
};
