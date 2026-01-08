
import React from 'react';
import { Asset, AssetStatus } from '../types';

interface AssetListProps {
  assets: Asset[];
  onViewAsset: (asset: Asset) => void;
}

const getStatusClass = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.InUse: return 'bg-green-100 text-green-800';
      case AssetStatus.InStock: return 'bg-blue-100 text-blue-800';
      case AssetStatus.InRepair: return 'bg-yellow-100 text-yellow-800';
      case AssetStatus.Retired: return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
};
  
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const AssetList: React.FC<AssetListProps> = ({ assets, onViewAsset }) => {

  if (assets.length === 0) {
    return (
      <div className="text-center p-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-text-main">No assets found</h3>
        <p className="mt-1 text-sm text-text-light">There are no assets matching your current filters.</p>
      </div>
    );
  }

  return (
    <div>
        {/* Mobile Card View */}
        <div className="md:hidden">
            <div className="px-4 py-4 space-y-4">
            {assets.map(asset => (
                <div key={asset.id} className="bg-white p-4 rounded-lg shadow ring-1 ring-black ring-opacity-5">
                    <div className="flex items-center justify-between">
                         <p className="text-sm font-semibold text-primary truncate">{asset.brand} {asset.model}</p>
                         <button onClick={() => onViewAsset(asset)} className="text-primary hover:text-primary-dark text-sm font-medium">View</button>
                    </div>
                    <p className="text-xs text-text-light mt-1">{asset.serialNumber}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-text-main">{asset.type}</span>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(asset.status)}`}>
                            {asset.status}
                        </span>
                    </div>
                     <div className="mt-2 pt-2 border-t flex justify-between items-center">
                        <p className="text-xs text-text-light">Assigned: <span className="font-medium text-text-main">{asset.assignedUser ? asset.assignedUser.name : 'N/A'}</span></p>
                        <p className="text-xs text-text-light">Warranty: {formatDate(asset.warrantyExpiry)}</p>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Asset Details</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Assigned To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Warranty Expiry</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-main">{asset.brand} {asset.model}</div>
                    <div className="text-sm text-text-light">{asset.serialNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">{asset.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {asset.assignedUser ? asset.assignedUser.name : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">{formatDate(asset.warrantyExpiry)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onViewAsset(asset)} className="text-primary hover:text-primary-dark">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default AssetList;