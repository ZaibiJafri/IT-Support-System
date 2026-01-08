
import React, { useState } from 'react';
import UserList from '../components/UserList';
import { useData } from '../contexts/DataContext';
import { User, UserStatus, UserRole } from '../types';
import Modal from '../components/Modal';
import CreateUserForm from '../components/CreateUserForm';
import UserDetail from '../components/UserDetail';

const UserManagementPage: React.FC = () => {
    const { users, addUser, updateUser } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAddUser = (newUserData: Omit<User, 'id'>) => {
        addUser(newUserData);
        setIsCreateModalOpen(false);
    };

    const handleUpdateUser = (updatedUser: User) => {
      updateUser(updatedUser);
      setSelectedUser(null);
    }

    const handleEditUser = (user: User) => {
      setSelectedUser(user);
    }

    const filteredUsers = users
        .filter(user => statusFilter === 'all' || user.status === statusFilter)
        .filter(user => roleFilter === 'all' || user.role === roleFilter)
        .filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.department.toLowerCase().includes(searchTerm.toLowerCase())
        );

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl text-text-main font-bold">User Management</h1>
          <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                  <label htmlFor="search" className="block text-sm font-medium text-text-light">Search</label>
                  <input 
                      type="text" 
                      id="search" 
                      placeholder="Search by name, email..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  />
              </div>
              <div>
                  <label htmlFor="status" className="block text-sm font-medium text-text-light">Status</label>
                  <select 
                      id="status"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as UserStatus | 'all')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                      <option value="all">All Statuses</option>
                      {Object.values(UserStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label htmlFor="role" className="block text-sm font-medium text-text-light">Role</label>
                  <select 
                      id="role"
                      value={roleFilter}
                      onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                      <option value="all">All Roles</option>
                      {Object.values(UserRole).map(role => (
                          <option key={role} value={role}>{role}</option>
                      ))}
                  </select>
              </div>
              <div className="flex items-end">
                  <button className="bg-gray-200 hover:bg-gray-300 text-text-main font-bold py-2 px-4 rounded-lg w-full transition-colors duration-200" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setRoleFilter('all'); }}>
                      Clear Filters
                  </button>
              </div>
          </div>
        </div>

        {/* User List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <UserList users={filteredUsers} onEditUser={handleEditUser} />
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New User">
        <CreateUserForm onSubmit={handleAddUser} />
      </Modal>

      {selectedUser && (
        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title={`Edit User - ${selectedUser.name}`}>
          <UserDetail user={selectedUser} onUpdate={handleUpdateUser} />
        </Modal>
      )}
    </>
  );
};

export default UserManagementPage;
