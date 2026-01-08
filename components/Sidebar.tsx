
import React, { useEffect, useRef } from 'react';
import { DashboardIcon, TicketIcon, AssetIcon, ReportIcon, UserIcon, SettingsIcon, BookOpenIcon, MailIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
  const { currentUser } = useAuth();
  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target as Node) || trigger.current.contains(target as Node)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });
  
  const allMenuItems = [
    { icon: DashboardIcon, label: 'Dashboard', roles: [UserRole.Admin, UserRole.IT] },
    { icon: TicketIcon, label: 'Tickets', roles: [UserRole.Admin, UserRole.IT] },
    { icon: MailIcon, label: 'Mailbox', roles: [UserRole.Admin, UserRole.IT] },
    { icon: AssetIcon, label: 'Asset Management', roles: [UserRole.Admin, UserRole.IT] },
    { icon: BookOpenIcon, label: 'Knowledge Base', roles: [UserRole.Admin, UserRole.IT] },
    { icon: ReportIcon, label: 'Reports', roles: [UserRole.Admin, UserRole.IT] },
    { icon: UserIcon, label: 'User Management', roles: [UserRole.Admin] },
    { icon: SettingsIcon, label: 'Settings', roles: [UserRole.Admin] },
  ];

  const menuItems = allMenuItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  return (
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:hover:w-64 shrink-0 bg-sidebar text-gray-200 transition-all duration-300 ease-in-out group ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2 h-16 items-center">
            <div className="flex items-center ml-4">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#3B82F6"/>
                    <path d="M12 2L22 7V17L12 22" fill="#2563EB"/>
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.5"/>
                </svg>
                <h1 className="text-xl font-bold ml-2 lg:hidden group-hover:lg:block">IT-Support</h1>
            </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
            {menuItems.map(item => (
                <button 
                  key={item.label} 
                  onClick={() => {
                    setCurrentPage(item.label);
                    if (sidebarOpen) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center p-2 mx-4 rounded-lg transition-colors duration-200 w-[calc(100%-2rem)] text-left ${currentPage === item.label ? 'bg-sidebar-accent text-white' : 'hover:bg-sidebar-accent hover:text-white'}`}
                >
                    <item.icon className="w-6 h-6 shrink-0" />
                    <span className="ml-4 text-sm font-medium lg:hidden group-hover:lg:block">{item.label}</span>
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;