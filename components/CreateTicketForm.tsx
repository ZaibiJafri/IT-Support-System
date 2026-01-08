
import React, { useState } from 'react';
import { TicketPriority, User, TicketCategory } from '../types';

interface CreateTicketFormProps {
    onSubmit: (data: any) => void;
    users: User[];
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onSubmit, users }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [userId, setUserId] = useState('');
    const [priority, setPriority] = useState<TicketPriority>(TicketPriority.Medium);
    const [category, setCategory] = useState<TicketCategory>(TicketCategory.Software);
    const [department, setDepartment] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === userId);
        if (!selectedUser) {
            alert("Please select a user.");
            return;
        }
        onSubmit({ 
            subject,
            description,
            user: {
                id: selectedUser.id,
                name: selectedUser.name,
                avatar: selectedUser.avatar
            },
            priority,
            category,
            department
        });
    };
    
    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = users.find(u => u.id === e.target.value);
        setUserId(e.target.value);
        if (selectedUser) {
            setDepartment(selectedUser.department);
        } else {
            setDepartment('');
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-light">Subject</label>
                <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>
             <div>
                <label htmlFor="user" className="block text-sm font-medium text-text-light">User</label>
                <select
                    id="user"
                    value={userId}
                    onChange={handleUserChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                >
                    <option value="" disabled>Select a user</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name} - {user.department}</option>
                    ))}
                </select>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-light">Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-light">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as TicketCategory)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    >
                        {Object.values(TicketCategory).map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-text-light">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TicketPriority)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    >
                        {Object.values(TicketPriority).map(p => (
                             <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Submit Ticket
                </button>
            </div>
        </form>
    );
};

export default CreateTicketForm;