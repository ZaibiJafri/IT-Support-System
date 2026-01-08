
import React, { useState } from 'react';
import { User, UserRole, UserStatus } from '../types';

interface UserDetailProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onUpdate }) => {
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);
  const [department, setDepartment] = useState(user.department);
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    const updatedUser = { ...user, role, status, department };
    if (newPassword) {
      updatedUser.password = newPassword;
    }
    onUpdate(updatedUser);
  };
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
      <div className="flex items-center space-x-4">
        <img className="h-16 w-16 rounded-full object-cover" src={user.avatar} alt={user.name} />
        <div>
          <h3 className="text-lg font-bold text-text-main">{user.name}</h3>
          <p className="text-sm text-text-light">{user.email}</p>
        </div>
      </div>
      
      <div className="pt-4 border-t">
          <label htmlFor="department" className="block text-sm font-medium text-text-light">Department</label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-text-light">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          >
            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-light">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          >
            {Object.values(UserStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-md font-semibold text-text-main">Change Password</h4>
        <p className="text-xs text-text-light mb-2">Leave blank to keep the current password.</p>
        <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-light">New Password</label>
            <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
            />
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default UserDetail;