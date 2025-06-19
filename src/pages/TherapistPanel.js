import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBox from '../components/ChatBox';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TherapistPanel = () => {
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [therapist, setTherapist] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('therapistToken') || '');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [chatLogs, setChatLogs] = useState([]);
  const [expandedChats, setExpandedChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/therapists/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem('therapistToken', res.data.token);
      setTherapist(res.data.user);
      setStep('dashboard');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  // Fetch profile and appointments after login
  useEffect(() => {
    const fetchProfileAndAppointments = async () => {
      if (!token || !therapist) return;
      setLoading(true);
      try {
        // Use therapist.id or therapist._id
        const therapistId = therapist.id || therapist._id;
        const res = await axios.get(`${API_URL}/therapists/${therapistId}`);
        setProfile(res.data);
        // Fetch appointments for this therapist
        const appRes = await axios.get(`${API_URL}/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(appRes.data.filter(a => a.therapistId?._id === therapistId));
      } catch (err) {
        setError('Failed to fetch profile or appointments');
      } finally {
        setLoading(false);
      }
    };
    if (step === 'dashboard' && therapist) fetchProfileAndAppointments();
    // Fetch all chat logs for monitoring
    const fetchChatLogs = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/chatbot/logs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChatLogs(res.data);
      } catch (err) {
        // Optionally handle error
      }
    };
    if (step === 'dashboard' && therapist) fetchChatLogs();
    // eslint-disable-next-line
  }, [step, therapist, token]);

  // Profile update handler
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await axios.put(`${API_URL}/therapists/${profile._id}`, profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  // Accept/reject/complete appointment
  const fetchAppointments = async (therapistId, token) => {
    const appRes = await axios.get(`${API_URL}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return appRes.data.filter(a => a.therapistId?._id === therapistId);
  };

  const handleAppointmentAction = async (id, status) => {
    setError('');
    setSuccess('');
    const mappedStatus =
      status === 'accepted'
        ? 'confirmed'
        : status === 'rejected'
        ? 'cancelled'
        : status;
    try {
      await axios.put(`${API_URL}/appointments/${id}`, { status: mappedStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Re-fetch appointments after update
      const therapistId = therapist.id || therapist._id;
      const updatedAppointments = await fetchAppointments(therapistId, token);
      setAppointments(updatedAppointments);
      setSuccess(`Appointment ${mappedStatus}`);
    } catch (err) {
      setError('Failed to update appointment');
    }
  };

  // Logout
  const handleLogout = () => {
    setToken('');
    setTherapist(null);
    setProfile(null);
    setStep('login');
    localStorage.removeItem('therapistToken');
  };

  const toggleExpand = (id) => {
    setExpandedChats((prev) =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Therapist Login</h2>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded p-2" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Therapist Panel</h1>
          <button onClick={handleLogout} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Logout</button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            {success && <div className="text-green-600 mb-2">{success}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {profile && (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full border rounded p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea name="bio" value={profile.bio} onChange={handleProfileChange} className="w-full border rounded p-2" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization (comma separated)</label>
                  <input type="text" name="specialization" value={Array.isArray(profile.specialization) ? profile.specialization.join(', ') : profile.specialization} onChange={e => setProfile(prev => ({ ...prev, specialization: e.target.value.split(',').map(s => s.trim()) }))} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience (years)</label>
                  <input type="number" name="experience" value={profile.experience} onChange={handleProfileChange} className="w-full border rounded p-2" />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Profile</button>
              </form>
            )}
          </div>
          {/* Appointment Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Appointment Requests</h2>
            {appointments.length === 0 ? (
              <div className="text-gray-500">No appointment requests.</div>
            ) : (
              <ul className="space-y-4">
                {appointments.map(app => (
                  <li key={app._id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold">{app.userId?.name || 'User'}</div>
                      <div className="text-sm text-gray-600">{new Date(app.startDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                      <div className="text-sm text-gray-600">Notes: {app.notes}</div>
                      <div className="text-sm text-gray-600">Status: <span className={app.status === 'confirmed' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}>{app.status}</span></div>
                    </div>
                    {app.status === 'pending' && (
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={() => handleAppointmentAction(app._id, 'accepted')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Accept</button>
                        <button onClick={() => handleAppointmentAction(app._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Reject</button>
                      </div>
                    )}
                    {app.status === 'confirmed' && (
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={() => handleAppointmentAction(app._id, 'completed')} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Mark as Completed</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Monitor Chats Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Monitor Chats</h2>
            {chatLogs.length === 0 ? (
              <div className="text-gray-500">No chat logs found.</div>
            ) : (
              <ul className="space-y-4">
                {chatLogs.map(log => (
                  <li key={log._id} className="border rounded p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{log.userId?.name || 'User'} <span className="text-xs text-gray-500">({log.userId?.email})</span></div>
                        <div className="text-sm text-gray-600">Last updated: {new Date(log.lastMessageAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                      </div>
                      <button
                        className="text-blue-600 underline text-sm"
                        onClick={() => toggleExpand(log._id)}
                      >
                        {expandedChats.includes(log._id) ? 'Collapse' : 'Expand'}
                      </button>
                    </div>
                    <div className="mt-2">
                      {(expandedChats.includes(log._id) ? log.messages : log.messages.slice(-3)).map((msg, idx) => (
                        <div key={idx} className="flex items-center mb-1">
                          <span className={`font-semibold mr-2 ${msg.role === 'user' ? 'text-blue-600' : msg.role === 'bot' ? 'text-green-600' : 'text-purple-600'}`}>
                            {msg.role === 'user' ? 'User:' : msg.role === 'bot' ? 'AI:' : 'Therapist:'}
                          </span>
                          <span className="text-gray-800">{msg.content}</span>
                        </div>
                      ))}
                      {!expandedChats.includes(log._id) && log.messages.length > 3 && (
                        <div className="text-xs text-gray-500">...({log.messages.length - 3} more messages)</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* User Chat Section */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mt-6 border border-green-100 animate-fade-in-up delay-600">
            <h2 className="text-xl font-bold mb-4 text-green-700">Chat with Your Users</h2>
            {appointments.filter(a => a.status === 'confirmed').length === 0 ? (
              <div className="text-gray-500">No confirmed appointments to chat with users.</div>
            ) : (
              <>
                <div className="mb-4 flex gap-4 overflow-x-auto pb-2">
                  {appointments.filter(a => a.status === 'confirmed').map(a => {
                    const u = a.userId;
                    if (!u) return null;
                    const isSelected = selectedUser && selectedUser._id === u._id;
                    return (
                      <button
                        key={u._id}
                        onClick={() => setSelectedUser(u)}
                        className={`flex flex-col items-center px-4 py-2 rounded-xl shadow transition border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-white hover:bg-blue-100'}`}
                        style={{ minWidth: 90 }}
                      >
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold mb-1 shadow"
                          style={{ background: `hsl(${u.name ? u.name.charCodeAt(0) * 10 % 360 : 200}, 70%, 85%)` }}
                        >
                          {(u.name || '?')[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-blue-900 text-center whitespace-nowrap">{u.name}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedUser && (
                  <ChatBox
                    currentUser={{ id: therapist?._id || therapist?.id, role: 'therapist', name: therapist?.name }}
                    chatPartner={{ id: selectedUser._id, role: 'user', name: selectedUser.name }}
                    token={token}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistPanel; 