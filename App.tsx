
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './containers/Dashboard';
import TicketsPage from './containers/TicketsPage';
import AssetManagementPage from './containers/AssetManagementPage';
import UserManagementPage from './containers/UserManagementPage';
import ReportsPage from './containers/ReportsPage';
import SettingsPage from './containers/SettingsPage';
import LoginPage from './containers/LoginPage';
import EmployeePortal from './containers/EmployeePortal';
import { useAuth } from './contexts/AuthContext';
import { UserRole } from './types';
import KnowledgeBasePage from './containers/KnowledgeBasePage';
import MailboxPage from './containers/MailboxPage';
import SupportDashboard from './containers/SupportDashboard';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const { currentUser } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        // Role-based dashboard
        return currentUser?.role === UserRole.Admin ? <Dashboard /> : <SupportDashboard />;
      case 'Tickets':
        return <TicketsPage />;
      case 'Mailbox':
        return <MailboxPage />;
      case 'Asset Management':
        return <AssetManagementPage />;
      case 'Knowledge Base':
        return <KnowledgeBasePage />;
      case 'User Management':
        return <UserManagementPage />;
      case 'Reports':
        return <ReportsPage />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return currentUser?.role === UserRole.Admin ? <Dashboard /> : <SupportDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <LoginPage />;
  }
  
  const isITStaff = currentUser.role === UserRole.Admin || currentUser.role === UserRole.IT;

  if (isITStaff) {
    return <AdminLayout />;
  } else {
    return <EmployeePortal />;
  }
};

export default App;