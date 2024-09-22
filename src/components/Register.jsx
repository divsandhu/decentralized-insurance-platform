import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = (event) => {
        event.preventDefault(); // Prevent default form submission

        // Store user credentials in local storage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);

        // Redirect to login page after successful registration
        navigate('/login');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-white">Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" 
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Password" 
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                        Sign Up
                    </button>
                    {error && <p className="mt-4 text-red-500">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Signup;
