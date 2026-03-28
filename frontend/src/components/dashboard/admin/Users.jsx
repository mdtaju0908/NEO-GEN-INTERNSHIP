import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { api } from '../../../services/api';

const Users = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [users, setUsers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    email: '',
    organization: '',
    contactName: '',
    contactPhone: '',
    password: ''
  });

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      const data = await api.get('/users/partners');
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchPartners()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBlockStudent = async (userId) => {
    if (!window.confirm('Are you sure you want to block this student? They will not be able to login or apply.')) return;

    try {
      const response = await api.put(`/users/${userId}/block`, { isBlocked: true });
      const updatedUser = response.user || response;

      setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isBlocked: true, ...updatedUser } : u)));
      alert('Student blocked successfully');
    } catch (error) {
      console.error('Failed to block student:', error);
      alert('Failed to block student');
    }
  };

  const handleDeleteStudent = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this student and their applications? This action cannot be undone.')) return;

    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      alert('Student deleted successfully');
    } catch (error) {
      console.error('Failed to delete student:', error);
      alert('Failed to delete student');
    }
  };

  const handleCreatePartner = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/partner', newPartner);
      alert('Partner created successfully');
      setNewPartner({ email: '', organization: '', contactName: '', contactPhone: '', password: '' });
      setShowAddPartner(false);
      fetchPartners();
    } catch (error) {
      console.error('Failed to create partner:', error);
      alert('Failed to create partner: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'partners'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Partners
          </button>
        </div>
        {activeTab === 'partners' && (
          <Button onClick={() => setShowAddPartner(true)} className="ml-4">
            Add Partner
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                {activeTab === 'students' && (
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                )}
                 {activeTab === 'partners' && (
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td>
                </tr>
              ) : (activeTab === 'students' ? users : partners).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">No users found.</td>
                </tr>
              ) : (
                (activeTab === 'students' ? users : partners).map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.role}
                    </td>
                    {activeTab === 'students' && (
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {user.university || '-'}
                       </td>
                    )}
                     {activeTab === 'partners' && (
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                         {user.organization || '-'}
                       </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {activeTab === 'students' && (
                        <>
                          <button 
                            onClick={() => handleBlockStudent(user._id)}
                            className={`${user.isBlocked ? 'text-gray-500' : 'text-orange-600 hover:text-orange-900'}`}
                            disabled={user.isBlocked}
                          >
                            {user.isBlocked ? 'Blocked' : 'Block'}
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {activeTab === 'partners' && (
                        <span className="text-gray-400">No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={showAddPartner}
        onClose={() => setShowAddPartner(false)}
        title="Create Partner Account"
      >
        <form onSubmit={handleCreatePartner} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={newPartner.email}
              onChange={(e) => setNewPartner(prev => ({ ...prev, email: e.target.value }))}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <input
              type="text"
              value={newPartner.organization}
              onChange={(e) => setNewPartner(prev => ({ ...prev, organization: e.target.value }))}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <input
              type="text"
              value={newPartner.contactName}
              onChange={(e) => setNewPartner(prev => ({ ...prev, contactName: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="text"
              value={newPartner.contactPhone}
              onChange={(e) => setNewPartner(prev => ({ ...prev, contactPhone: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password (Optional)</label>
            <input
              type="password"
              value={newPartner.password}
              onChange={(e) => setNewPartner(prev => ({ ...prev, password: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Leave blank for auto-generated"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setShowAddPartner(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Partner
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
