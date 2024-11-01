import React, { useState } from 'react';
import BlockchainService from '../services/BlockchainServices';
import { FaMoneyBillWave, FaShieldAlt, FaClock, FaTag } from 'react-icons/fa';

const PolicyPurchase = () => {
    const [premium, setPremium] = useState('100'); // Default value
    const [coverage, setCoverage] = useState('1'); // Default value
    const [duration, setDuration] = useState('2456'); // Default value
    const [policyType, setPolicyType] = useState('Basic Policy'); // Default value
    const [message, setMessage] = useState('');

    const handlePurchase = async (e) => {
        e.preventDefault();
        try {
            const result = await BlockchainService.createPolicy(
                premium,
                coverage,
                duration,
                policyType
            );
            setMessage(`Policy created! Transaction Hash: ${result.transactionHash}`);
        } catch (error) {
            setMessage('Error creating policy: ' + error.message);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Purchase Policy</h2>
            <form onSubmit={handlePurchase} className="space-y-4">
                <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2 text-xl" />
                    <input
                        type="text"
                        value={premium}
                        onChange={(e) => setPremium(e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                        placeholder="Premium (default: 100)"
                    />
                </div>
                <div className="flex items-center">
                    <FaShieldAlt className="mr-2 text-xl" />
                    <input
                        type="text"
                        value={coverage}
                        onChange={(e) => setCoverage(e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                        placeholder="Coverage (default: 1)"
                    />
                </div>
                <div className="flex items-center">
                    <FaClock className="mr-2 text-xl" />
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                        placeholder="Duration (in seconds, default: 2456)"
                    />
                </div>
                <div className="flex items-center">
                    <FaTag className="mr-2 text-xl" />
                    <input
                        type="text"
                        value={policyType}
                        onChange={(e) => setPolicyType(e.target.value)}
                        className="mt-1 p-2 border rounded w-full"
                        placeholder="Policy Type (default: Basic Policy)"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600">
                    Purchase Policy
                </button>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
};

export default PolicyPurchase;
