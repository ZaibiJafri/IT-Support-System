
import React, { useState } from 'react';
import { UserRole, UserStatus } from '../types';

interface CreateUserFormProps {
    onSubmit: (data: any) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.Employee);
    const [status, setStatus] = useState<UserStatus>(UserStatus.Active);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }
        setPasswordError('');
        onSubmit({ 
            name,
            email,
            department,
            role,
            status,
            password,
            avatar: `https://picsum.photos/seed/${name}/200/200` // Random avatar
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-light">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-light">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
            </div>
            <div>
                <label htmlFor="department" className="block text-sm font-medium text-text-light">Department</label>
                <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-light">Role</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required>
                        {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-text-light">Status</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as UserStatus)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required>
                        {Object.values(UserStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-light">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light">Confirm Password</label>
                    <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
            </div>
             {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                    Add User
                </button>
            </div>
        </form>
    );
};

export default CreateUserForm;