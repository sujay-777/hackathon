import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaTrash, FaUserPlus, FaUserMd, FaClipboardList, FaCalendarAlt, FaComments, FaUserFriends, FaCheck, FaTimes } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminPanel = () => {
  const [tab, setTab] = useState('dashboard');
  // Users state
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState(null);
  // Therapists state
  const [therapists, setTherapists] = useState([]);
  const [therapistForm, setTherapistForm] = useState({ name: '', email: '', password: '', specialization: '', bio: '', experience: '' });
  const [editingTherapist, setEditingTherapist] = useState(null);
  // Feedback
  const [message, setMessage] = useState('');
  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({ status: '', notes: '' });
  // Chat logs state
  const [chatLogs, setChatLogs] = useState([]);
  const [expandedChat, setExpandedChat] = useState(null);

  const adminToken = localStorage.getItem('adminToken');

  // Fetch users
  useEffect(() => {
    if (tab === 'users') {
      axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${adminToken}` } })
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
    }
    if (tab === 'therapists') {
      axios.get(`${API_URL}/therapists`, { headers: { Authorization: `Bearer ${adminToken}` } })
        .then(res => setTherapists(res.data))
        .catch(() => setTherapists([]));
    }
  }, [tab, adminToken, message]);

  // Fetch appointments and chat logs
  useEffect(() => {
    if (tab === 'appointments') {
      axios.get(`${API_URL}/appointments/admin/all`, { headers: { Authorization: `Bearer ${adminToken}` } })
        .then(res => setAppointments(res.data))
        .catch(() => setAppointments([]));
    }
    if (tab === 'chatlogs') {
      axios.get(`${API_URL}/chatbot/logs`, { headers: { Authorization: `Bearer ${adminToken}` } })
        .then(res => setChatLogs(res.data))
        .catch(() => setChatLogs([]));
    }
  }, [tab, adminToken, message]);

  // User CRUD handlers
  const handleUserFormChange = e => setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleUserCreate = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, userForm, { headers: { Authorization: `Bearer ${adminToken}` } });
      setMessage('User created');
      setUserForm({ name: '', email: '', password: '', role: 'user' });
    } catch {
      setMessage('Error creating user');
    }
  };
  const handleUserDelete = async id => {
    await axios.delete(`${API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    setMessage('User deleted');
  };
  const handleUserEdit = user => setEditingUser(user);
  const handleUserUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/${editingUser._id}`, userForm, { headers: { Authorization: `Bearer ${adminToken}` } });
      setMessage('User updated');
      setEditingUser(null);
      setUserForm({ name: '', email: '', password: '', role: 'user' });
    } catch {
      setMessage('Error updating user');
    }
  };

  // Therapist CRUD handlers
  const handleTherapistFormChange = e => setTherapistForm({ ...therapistForm, [e.target.name]: e.target.value });
  const handleTherapistCreate = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/therapists`, therapistForm, { headers: { Authorization: `Bearer ${adminToken}` } });
      setMessage('Therapist created');
      setTherapistForm({ name: '', email: '', password: '', specialization: '', bio: '', experience: '' });
    } catch {
      setMessage('Error creating therapist');
    }
  };
  const handleTherapistDelete = async id => {
    await axios.delete(`${API_URL}/therapists/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    setMessage('Therapist deleted');
  };
  const handleTherapistEdit = t => setEditingTherapist(t);
  const handleTherapistUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/therapists/${editingTherapist._id}`, therapistForm, { headers: { Authorization: `Bearer ${adminToken}` } });
      setMessage('Therapist updated');
      setEditingTherapist(null);
      setTherapistForm({ name: '', email: '', password: '', specialization: '', bio: '', experience: '' });
    } catch {
      setMessage('Error updating therapist');
    }
  };

  // Appointment CRUD handlers
  const handleAppointmentEdit = appt => {
    setEditingAppointment(appt);
    setAppointmentForm({ status: appt.status, notes: appt.notes || '' });
  };
  const handleAppointmentUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/appointments/admin/${editingAppointment._id}`, appointmentForm, { headers: { Authorization: `Bearer ${adminToken}` } });
      setMessage('Appointment updated');
      setEditingAppointment(null);
      setAppointmentForm({ status: '', notes: '' });
    } catch {
      setMessage('Error updating appointment');
    }
  };
  const handleAppointmentDelete = async id => {
    await axios.delete(`${API_URL}/appointments/admin/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    setMessage('Appointment deleted');
  };

  // Chat log handlers
  const handleChatLogDelete = async id => {
    await axios.delete(`${API_URL}/chatbot/logs/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } });
    setMessage('Chat log deleted');
  };
  const handleExpandChat = id => setExpandedChat(expandedChat === id ? null : id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8 animate-fade-in-up">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 drop-shadow-lg flex items-center gap-2"><FaClipboardList className="text-blue-500" /> Admin Panel</h1>
      <div className="flex flex-wrap gap-4 mb-8 animate-fade-in-up delay-100">
        <button onClick={() => setTab('dashboard')} className={`px-4 py-2 rounded-xl font-bold shadow transition-all duration-200 flex items-center gap-2 ${tab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white/80 border border-blue-200 hover:bg-blue-100'}`}><FaClipboardList /> Dashboard</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded-xl font-bold shadow transition-all duration-200 flex items-center gap-2 ${tab === 'users' ? 'bg-pink-600 text-white' : 'bg-white/80 border border-pink-200 hover:bg-pink-100'}`}><FaUserFriends /> Users</button>
        <button onClick={() => setTab('therapists')} className={`px-4 py-2 rounded-xl font-bold shadow transition-all duration-200 flex items-center gap-2 ${tab === 'therapists' ? 'bg-purple-600 text-white' : 'bg-white/80 border border-purple-200 hover:bg-purple-100'}`}><FaUserMd /> Therapists</button>
        <button onClick={() => setTab('appointments')} className={`px-4 py-2 rounded-xl font-bold shadow transition-all duration-200 flex items-center gap-2 ${tab === 'appointments' ? 'bg-green-600 text-white' : 'bg-white/80 border border-green-200 hover:bg-green-100'}`}><FaCalendarAlt /> Appointments</button>
        <button onClick={() => setTab('chatlogs')} className={`px-4 py-2 rounded-xl font-bold shadow transition-all duration-200 flex items-center gap-2 ${tab === 'chatlogs' ? 'bg-indigo-600 text-white' : 'bg-white/80 border border-indigo-200 hover:bg-indigo-100'}`}><FaComments /> Chat Logs</button>
      </div>
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 min-h-[300px] border border-blue-100 animate-fade-in-up delay-200">
        {message && <div className="mb-4 text-green-600 font-bold animate-fade-in-up delay-300">{message}</div>}
        {tab === 'dashboard' && <div className="text-lg text-gray-600">Dashboard/Statistics (Coming Soon)</div>}
        {tab === 'users' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-pink-700 flex items-center gap-2"><FaUserFriends /> Users</h2>
            <form onSubmit={editingUser ? handleUserUpdate : handleUserCreate} className="mb-4 flex flex-wrap gap-2">
              <input name="name" value={userForm.name} onChange={handleUserFormChange} placeholder="Name" className="border border-pink-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all" required />
              <input name="email" value={userForm.email} onChange={handleUserFormChange} placeholder="Email" className="border border-pink-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all" required />
              <input name="password" value={userForm.password} onChange={handleUserFormChange} placeholder="Password" className="border border-pink-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all" type="password" required={!editingUser} />
              <select name="role" value={userForm.role} onChange={handleUserFormChange} className="border border-pink-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-pink-700 transition-all duration-200 flex items-center gap-2">{editingUser ? <FaUserEdit /> : <FaUserPlus />} {editingUser ? 'Update' : 'Create'}</button>
              {editingUser && <button type="button" onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', password: '', role: 'user' }); }} className="bg-gray-400 text-white px-4 py-2 rounded-xl font-bold shadow flex items-center gap-2"><FaTimes /> Cancel</button>}
            </form>
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-xl overflow-hidden">
                <thead className="bg-pink-100">
                  <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b hover:bg-pink-50 transition-all">
                      <td className="p-2">{u.name}</td>
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.role}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => { setEditingUser(u); setUserForm({ name: u.name, email: u.email, password: '', role: u.role }); }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1"><FaUserEdit /> Edit</button>
                        <button onClick={() => handleUserDelete(u._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1"><FaTrash /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'therapists' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-purple-700 flex items-center gap-2"><FaUserMd /> Therapists</h2>
            <form onSubmit={editingTherapist ? handleTherapistUpdate : handleTherapistCreate} className="mb-4 flex flex-wrap gap-2">
              <input name="name" value={therapistForm.name} onChange={handleTherapistFormChange} placeholder="Name" className="border border-purple-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" required />
              <input name="email" value={therapistForm.email} onChange={handleTherapistFormChange} placeholder="Email" className="border border-purple-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" required />
              <input name="password" value={therapistForm.password} onChange={handleTherapistFormChange} placeholder="Password" className="border border-purple-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" type="password" required={!editingTherapist} />
              <input name="specialization" value={therapistForm.specialization} onChange={handleTherapistFormChange} placeholder="Specialization" className="border border-purple-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" />
              <input name="bio" value={therapistForm.bio} onChange={handleTherapistFormChange} placeholder="Bio" className="border border-purple-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" />
              <input name="experience" value={therapistForm.experience} onChange={handleTherapistFormChange} placeholder="Experience" className="border border-purple-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all" type="number" />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-purple-700 transition-all duration-200 flex items-center gap-2">{editingTherapist ? <FaUserEdit /> : <FaUserPlus />} {editingTherapist ? 'Update' : 'Create'}</button>
              {editingTherapist && <button type="button" onClick={() => { setEditingTherapist(null); setTherapistForm({ name: '', email: '', password: '', specialization: '', bio: '', experience: '' }); }} className="bg-gray-400 text-white px-4 py-2 rounded-xl font-bold shadow flex items-center gap-2"><FaTimes /> Cancel</button>}
            </form>
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-xl overflow-hidden">
                <thead className="bg-purple-100">
                  <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Specialization</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                  {therapists.map(t => (
                    <tr key={t._id} className="border-b hover:bg-purple-50 transition-all">
                      <td className="p-2">{t.name}</td>
                      <td className="p-2">{t.email}</td>
                      <td className="p-2">{Array.isArray(t.specialization) ? t.specialization.join(', ') : t.specialization}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => { setEditingTherapist(t); setTherapistForm({ name: t.name, email: t.email, password: '', specialization: Array.isArray(t.specialization) ? t.specialization.join(', ') : t.specialization, bio: t.bio, experience: t.experience }); }} className="text-blue-600 hover:text-blue-800 flex items-center gap-1"><FaUserEdit /> Edit</button>
                        <button onClick={() => handleTherapistDelete(t._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1"><FaTrash /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'appointments' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-green-700 flex items-center gap-2"><FaCalendarAlt /> Appointments</h2>
            {editingAppointment ? (
              <form onSubmit={handleAppointmentUpdate} className="mb-4 flex flex-wrap gap-2">
                <select name="status" value={appointmentForm.status} onChange={e => setAppointmentForm({ ...appointmentForm, status: e.target.value })} className="border border-green-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
                <input name="notes" value={appointmentForm.notes} onChange={e => setAppointmentForm({ ...appointmentForm, notes: e.target.value })} placeholder="Notes" className="border border-green-300 p-2 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-all" />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-green-700 transition-all duration-200 flex items-center gap-2"><FaCheck /> Update</button>
                <button type="button" onClick={() => setEditingAppointment(null)} className="bg-gray-400 text-white px-4 py-2 rounded-xl font-bold shadow flex items-center gap-2"><FaTimes /> Cancel</button>
              </form>
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-xl overflow-hidden">
                <thead className="bg-green-100">
                  <tr><th className="p-2">User</th><th className="p-2">Therapist</th><th className="p-2">Date/Time</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a._id} className="border-b hover:bg-green-50 transition-all">
                      <td className="p-2">{a.userId?.name || 'User'}</td>
                      <td className="p-2">{a.therapistId?.name || 'Therapist'}</td>
                      <td className="p-2">{new Date(a.startDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                      <td className="p-2">{a.status}</td>
                      <td className="p-2 flex gap-2">
                        <button onClick={() => handleAppointmentEdit(a)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1"><FaUserEdit /> Edit</button>
                        <button onClick={() => handleAppointmentDelete(a._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1"><FaTrash /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'chatlogs' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-indigo-700 flex items-center gap-2"><FaComments /> Chat Logs</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left rounded-xl overflow-hidden">
                <thead className="bg-indigo-100">
                  <tr><th className="p-2">User</th><th className="p-2">Messages</th><th className="p-2">Actions</th></tr>
                </thead>
                <tbody>
                  {chatLogs.map(log => (
                    <tr key={log._id} className="border-b hover:bg-indigo-50 transition-all">
                      <td className="p-2">{log.userId?.name || 'User'}</td>
                      <td className="p-2">
                        <button onClick={() => handleExpandChat(log._id)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          {expandedChat === log._id ? <FaTimes /> : <FaComments />} {expandedChat === log._id ? 'Hide' : 'View'}
                        </button>
                        {expandedChat === log._id && (
                          <div className="mt-2 bg-white/80 border border-blue-200 rounded-xl p-2 shadow">
                            {log.messages.map((msg, idx) => (
                              <div key={idx} className="mb-1 text-sm">
                                <span className={`font-bold ${msg.role === 'user' ? 'text-blue-600' : 'text-green-600'}`}>{msg.role === 'user' ? 'User:' : 'Bot:'}</span> {msg.content}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <button onClick={() => handleChatLogDelete(log._id)} className="text-red-600 hover:text-red-800 flex items-center gap-1"><FaTrash /> Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
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
    </div>
  );
};

export default AdminPanel; 