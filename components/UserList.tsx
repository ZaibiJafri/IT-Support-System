
import React from 'react';
import { User, UserStatus } from '../types';
import { EditIcon } from './icons';

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
}

const getStatusClass = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Active: return 'bg-green-100 text-green-800';
      case UserStatus.Inactive: return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const UserList: React.FC<UserListProps> = ({ users, onEditUser }) => {

  if (users.length === 0) {
    return (
      <div className="text-center p-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-text-main">No users found</h3>
        <p className="mt-1 text-sm text-text-light">There are no users matching your current filters.</p>
      </div>
    );
  }

  return (
    <div>
        {/* Mobile Card View */}
        <div className="md:hidden">
            <div className="px-4 py-4 space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-4 rounded-lg shadow ring-1 ring-black ring-opacity-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                                <div>
                                    <p className="text-sm font-semibold text-primary truncate">{user.name}</p>
                                    <p className="text-xs text-text-light">{user.email}</p>
                                </div>
                            </div>
                            <button onClick={() => onEditUser(user)} className="text-primary hover:text-primary-dark text-sm font-medium">Edit</button>
                        </div>
                        <div className="mt-4 pt-2 border-t flex justify-between items-center">
                            <div>
                                <p className="text-xs text-text-light">Role: <span className="font-medium text-text-main">{user.role}</span></p>
                                <p className="text-xs text-text-light">Dept: <span className="font-medium text-text-main">{user.department}</span></p>
                            </div>
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                                {user.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="" />
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-text-main">{user.name}</div>
                            <div className="text-sm text-text-light">{user.email}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">{user.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                        {user.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => onEditUser(user)} className="text-primary hover:text-primary-dark flex items-center gap-1 ml-auto">
                        <EditIcon className="w-4 h-4" />
                        Edit
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default UserList;