
import React, { useState } from 'react';
import { AssetType, AssetStatus, User } from '../types';

interface CreateAssetFormProps {
    onSubmit: (data: any) => void;
    users: User[];
}

const CreateAssetForm: React.FC<CreateAssetFormProps> = ({ onSubmit, users }) => {
    const [type, setType] = useState<AssetType>(AssetType.Laptop);
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
    const [warrantyExpiry, setWarrantyExpiry] = useState('');
    const [status, setStatus] = useState<AssetStatus>(AssetStatus.InStock);
    const [assignedUserId, setAssignedUserId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.id === assignedUserId);
        onSubmit({
            type,
            brand,
            model,
            serialNumber,
            purchaseDate,
            warrantyExpiry,
            status,
            assignedUser: selectedUser ? { id: selectedUser.id, name: selectedUser.name } : null,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-text-light">Asset Type</label>
                    <select id="type" value={type} onChange={e => setType(e.target.value as AssetType)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required>
                        {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-text-light">Status</label>
                    <select id="status" value={status} onChange={e => setStatus(e.target.value as AssetStatus)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required>
                        {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-text-light">Brand</label>
                    <input type="text" id="brand" value={brand} onChange={e => setBrand(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="model" className="block text-sm font-medium text-text-light">Model</label>
                    <input type="text" id="model" value={model} onChange={e => setModel(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
            </div>
            <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-text-light">Serial Number</label>
                <input type="text" id="serialNumber" value={serialNumber} onChange={e => setSerialNumber(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium text-text-light">Purchase Date</label>
                    <input type="date" id="purchaseDate" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-text-light">Warranty Expiry</label>
                    <input type="date" id="warrantyExpiry" value={warrantyExpiry} onChange={e => setWarrantyExpiry(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
            </div>
             <div>
                <label htmlFor="assignedUser" className="block text-sm font-medium text-text-light">Assigned User</label>
                <select id="assignedUser" value={assignedUserId ?? ''} onChange={e => setAssignedUserId(e.target.value || null)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                    <option value="">Unassigned</option>
                    {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
                </select>
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                    Add Asset
                </button>
            </div>
        </form>
    );
};

export default CreateAssetForm;
