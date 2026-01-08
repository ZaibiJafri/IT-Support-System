
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { DownloadIcon, RefreshIcon } from '../components/icons';

const SettingsPage: React.FC = () => {
    const { tickets, assets, users, knowledgeBaseArticles } = useData();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [slaAlerts, setSlaAlerts] = useState(true);
    const [defaultPriority, setDefaultPriority] = useState('Medium');

    const handleExportData = () => {
        const allData = {
            tickets,
            assets,
            users,
            knowledgeBaseArticles,
            exportDate: new Date().toISOString(),
        };
        const dataStr = JSON.stringify(allData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'it-support-backup.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleResetData = () => {
        if (window.confirm('Are you sure you want to delete all data and reset to the demo state? This action cannot be undone.')) {
            localStorage.removeItem('tickets');
            localStorage.removeItem('assets');
            localStorage.removeItem('users');
            localStorage.removeItem('kb_articles');
            window.location.reload();
        }
    };

    const Toggle: React.FC<{ label: string; enabled: boolean; setEnabled: (e: boolean) => void }> = ({ label, enabled, setEnabled }) => (
        <div className="flex items-center justify-between py-4 border-b">
            <span className="text-text-main">{label}</span>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`${enabled ? 'bg-primary' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
            >
                <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
            </button>
        </div>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl text-text-main font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-text-main mb-4">Application</h2>
            <Toggle label="Email notifications on new tickets" enabled={emailNotifications} setEnabled={setEmailNotifications} />
            <Toggle label="SLA breach alerts" enabled={slaAlerts} setEnabled={setSlaAlerts} />

            <h3 className="text-lg font-semibold text-text-main mt-6 mb-2">Ticket Defaults</h3>
            <div className="flex items-center justify-between py-4">
                <label htmlFor="default-priority" className="text-text-main">Default ticket priority</label>
                <select
                    id="default-priority"
                    value={defaultPriority}
                    onChange={(e) => setDefaultPriority(e.target.value)}
                    className="w-48 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-text-main mb-4">Data Management</h2>
            <p className="text-sm text-text-light mb-4">
                Your data is saved in your browser's local storage. You can export it for backup or reset the application to its original demo state.
            </p>
            <div className="space-y-4">
                 <button
                    onClick={handleExportData}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Export All Data
                </button>
                <button
                    onClick={handleResetData}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                    <RefreshIcon className="w-5 h-5" />
                    Reset to Demo Data
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;