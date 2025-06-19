import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin-panel');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-fade-in-up">
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100 animate-fade-in-up delay-200">
        <div className="flex flex-col items-center mb-6">
          <FaUserShield className="text-6xl text-blue-500 mb-2 animate-fade-in-up delay-100" />
          <h2 className="text-2xl font-extrabold text-blue-700">Admin Login</h2>
        </div>
        {error && <div className="text-red-600 mb-2 font-bold animate-fade-in-up delay-300">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" required />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" required />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 rounded-xl font-bold shadow-md hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <style>{`
          .animate-fade-in-up {
            opacity: 0;
            transform: translateY(40px);
            animation: fadeInUp 1s forwards;
          }
          .animate-fade-in-up.delay-100 { animation-delay: 0.1s; }
          .animate-fade-in-up.delay-200 { animation-delay: 0.2s; }
          .animate-fade-in-up.delay-300 { animation-delay: 0.3s; }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: none;
            }
          }
        `}</style>
      </form>
    </div>
  );
};

export default AdminLogin; 