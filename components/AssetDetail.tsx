
import React, { useState } from 'react';
import { Asset, AssetStatus, User } from '../types';

interface AssetDetailProps {
  asset: Asset;
  users: User[];
  onUpdate: (updatedAsset: Asset) => void;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ asset, users, onUpdate }) => {
  const [status, setStatus] = useState<AssetStatus>(asset.status);
  const [assignedUserId, setAssignedUserId] = useState<string | null>(asset.assignedUser?.id ?? null);
  
  const handleSave = () => {
    const selectedUser = users.find(u => u.id === assignedUserId);
    onUpdate({
      ...asset,
      status,
      assignedUser: selectedUser ? { id: selectedUser.id, name: selectedUser.name } : null
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-text-main">{asset.brand} {asset.model}</h3>
        <p className="text-sm text-text-light">{asset.serialNumber}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-text-light">Type: <span className="font-medium text-text-main">{asset.type}</span></div>
        <div className="text-text-light">Purchase Date: <span className="font-medium text-text-main">{formatDate(asset.purchaseDate)}</span></div>
        <div className="text-text-light">Warranty Expiry: <span className="font-medium text-text-main">{formatDate(asset.warrantyExpiry)}</span></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-light">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as AssetStatus)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          >
            {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="assignedUser" className="block text-sm font-medium text-text-light">Assigned User</label>
          <select
            id="assignedUser"
            value={assignedUserId ?? ''}
            onChange={(e) => setAssignedUserId(e.target.value || null)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
          >
            <option value="">Unassigned</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AssetDetail;
