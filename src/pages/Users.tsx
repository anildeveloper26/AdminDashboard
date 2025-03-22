import { useState } from 'react';
import { UserPlus, Edit2, Power } from 'lucide-react';
import type { User } from '../types';

function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Only for new users
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
  });

  // Static mock data
  const [usersList, setUsersList] = useState<User[]>([
    {
      _id: '1',
      username: 'admin1',
      email: 'admin1@example.com',
      role: 'admin',
      isActive: true,
      lastLogin: '2025-03-21T10:00:00Z',
      createdAt: '2025-03-01T00:00:00Z',
    },
    {
      _id: '2',
      username: 'editor1',
      email: 'editor1@example.com',
      role: 'editor',
      isActive: true,
      lastLogin: '2025-03-20T15:30:00Z',
      createdAt: '2025-03-01T00:00:00Z',
    },
    {
      _id: '3',
      username: 'viewer1',
      email: 'viewer1@example.com',
      role: 'viewer',
      isActive: false,
      lastLogin: '2025-03-19T09:15:00Z',
      createdAt: '2025-03-01T00:00:00Z',
    },
  ]);

  const handleToggleStatus = (userId: string) => {
    setUsersList((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      // Update existing user
      setUsersList((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id
            ? { ...user, ...formData, lastLogin: user.lastLogin, createdAt: user.createdAt }
            : user
        )
      );
    } else {
      // Create new user
      const newUser: User = {
        _id: String(usersList.length + 1), // Simple ID generation
        username: formData.username,
        email: formData.email,
        password: formData.password, // In a real app, this would be hashed
        role: formData.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      setUsersList((prevUsers) => [...prevUsers, newUser]);
    }
    setIsModalOpen(false);
    setFormData({ username: '', email: '', password: '', role: 'viewer' });
    setSelectedUser(null);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't prefill password for edits
      role: user.role,
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <button
          onClick={() => {
            setSelectedUser(null);
            setFormData({ username: '', email: '', password: '', role: 'viewer' });
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersList.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(user._id)}
                    className={`${
                      user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {!selectedUser && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' | 'viewer' })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;