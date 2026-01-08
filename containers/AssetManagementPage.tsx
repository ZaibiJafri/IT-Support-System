
import React, { useState } from 'react';
import AssetList from '../components/AssetList';
import { useData } from '../contexts/DataContext';
import { Asset, AssetStatus, AssetType } from '../types';
import Modal from '../components/Modal';
import CreateAssetForm from '../components/CreateAssetForm';
import AssetDetail from '../components/AssetDetail';

const AssetManagementPage: React.FC = () => {
    const { assets, users, addAsset, updateAsset } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const handleAddAsset = (newAssetData: Omit<Asset, 'id'>) => {
        addAsset(newAssetData);
        setIsCreateModalOpen(false);
    };

    const handleUpdateAsset = (updatedAsset: Asset) => {
      updateAsset(updatedAsset);
      setSelectedAsset(null);
    }

    const handleViewAsset = (asset: Asset) => {
      setSelectedAsset(asset);
    }

    const filteredAssets = assets
        .filter(asset => statusFilter === 'all' || asset.status === statusFilter)
        .filter(asset => typeFilter === 'all' || asset.type === typeFilter)
        .filter(asset => 
            asset.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (asset.assignedUser && asset.assignedUser.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl text-text-main font-bold">Asset Management</h1>
          <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center">
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Asset
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
                      placeholder="Search by brand, model, SN..."
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
                      onChange={e => setStatusFilter(e.target.value as AssetStatus | 'all')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                      <option value="all">All Statuses</option>
                      {Object.values(AssetStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label htmlFor="type" className="block text-sm font-medium text-text-light">Asset Type</label>
                  <select 
                      id="type"
                      value={typeFilter}
                      onChange={e => setTypeFilter(e.target.value as AssetType | 'all')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                      <option value="all">All Types</option>
                      {Object.values(AssetType).map(type => (
                          <option key={type} value={type}>{type}</option>
                      ))}
                  </select>
              </div>
              <div className="flex items-end">
                  <button className="bg-gray-200 hover:bg-gray-300 text-text-main font-bold py-2 px-4 rounded-lg w-full transition-colors duration-200" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setTypeFilter('all'); }}>
                      Clear Filters
                  </button>
              </div>
          </div>
        </div>

        {/* Asset List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <AssetList assets={filteredAssets} onViewAsset={handleViewAsset} />
        </div>
      </div>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Asset">
        <CreateAssetForm onSubmit={handleAddAsset} users={users} />
      </Modal>

      {selectedAsset && (
        <Modal isOpen={!!selectedAsset} onClose={() => setSelectedAsset(null)} title={`Asset Details - ${selectedAsset.id}`}>
          <AssetDetail asset={selectedAsset} users={users} onUpdate={handleUpdateAsset} />
        </Modal>
      )}
    </>
  );
};

export default AssetManagementPage;
