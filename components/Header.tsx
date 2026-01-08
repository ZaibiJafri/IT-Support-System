
import React, { useState } from 'react';
import { MenuIcon, SearchIcon, BellIcon, SparklesIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';
import { GoogleGenAI, Type } from '@google/genai';
import { useData } from '../contexts/DataContext';
import { TicketStatus, TicketPriority, AssetStatus, AssetType } from '../types';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const SmartSearch: React.FC = () => {
    const { tickets, assets, setTickets, setAssets } = useData();
    const originalTickets = useData().tickets;
    const originalAssets = useData().assets;
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) {
            setTickets(originalTickets);
            setAssets(originalAssets);
            setActiveFilters({});
            return;
        }

        setIsLoading(true);
        setActiveFilters({});
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    target: { type: Type.STRING, enum: ['tickets', 'assets'], description: 'The type of data to search for.' },
                    filters: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                field: { type: Type.STRING, description: 'The field to filter on (e.g., status, priority, brand, user.name).' },
                                value: { type: Type.STRING, description: 'The value to filter by.' },
                            },
                            required: ['field', 'value'],
                        },
                    },
                },
            };

            const prompt = `Based on the user query "${searchTerm}", identify the target data (tickets or assets) and generate a list of filters to apply. Possible ticket fields are: status, priority, user.name, department. Possible asset fields are: status, type, brand, assignedUser.name.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                },
            });
            
            const result = JSON.parse(response.text);

            if (result.target === 'tickets') {
                let filtered = originalTickets;
                const newFilters: Record<string, string> = {};
                result.filters.forEach((filter: { field: string, value: string }) => {
                    newFilters[filter.field] = filter.value;
                    filtered = filtered.filter(ticket => {
                        const fieldValue = filter.field.split('.').reduce((o, i) => o[i], ticket as any);
                        return fieldValue.toLowerCase().includes(filter.value.toLowerCase());
                    });
                });
                setTickets(filtered);
                setActiveFilters(newFilters);
            } else if (result.target === 'assets') {
                let filtered = originalAssets;
                const newFilters: Record<string, string> = {};
                result.filters.forEach((filter: { field: string, value: string }) => {
                    newFilters[filter.field] = filter.value;
                    filtered = filtered.filter(asset => {
                        const fieldValue = filter.field.split('.').reduce((o, i) => o?.[i], asset as any);
                        return fieldValue?.toLowerCase().includes(filter.value.toLowerCase());
                    });
                });
                setAssets(filtered);
                setActiveFilters(newFilters);
            }

        } catch (error) {
            console.error("Smart Search Error:", error);
            // Fallback to simple search
            const lowerCaseTerm = searchTerm.toLowerCase();
            setTickets(originalTickets.filter(t => t.subject.toLowerCase().includes(lowerCaseTerm) || t.description.toLowerCase().includes(lowerCaseTerm)));
            setAssets(originalAssets.filter(a => a.brand.toLowerCase().includes(lowerCaseTerm) || a.model.toLowerCase().includes(lowerCaseTerm) || a.serialNumber.toLowerCase().includes(lowerCaseTerm)));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="search"
                    placeholder="Smart Search: 'open tickets for finance'..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SparklesIcon className="w-5 h-5 text-primary" />
                </div>
                {isLoading && <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-500">Thinking...</div>}
            </form>
             {Object.keys(activeFilters).length > 0 && (
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
                    <span>AI Filters:</span>
                    {Object.entries(activeFilters).map(([key, value]) => (
                        <span key={key} className="bg-gray-200 px-2 py-0.5 rounded-full">{key}: {value}</span>
                    ))}
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Header: Left side */}
          <div className="flex">
            {/* Hamburger button */}
            <button
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Header: Right side */}
          <div className="flex items-center space-x-3">
            <SmartSearch />
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 h-2 w-2 mt-1 mr-1 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative inline-flex">
                <div className="flex items-center space-x-2">
                    <img className="h-9 w-9 rounded-full object-cover" src={currentUser?.avatar} alt="User" />
                    <div>
                        <div className="font-semibold text-text-main text-sm">{currentUser?.name}</div>
                        <div className="text-xs text-text-light">{currentUser?.role}</div>
                    </div>
                </div>
            </div>
            {/* Logout Button */}
            <button onClick={logout} className="text-sm text-gray-500 hover:text-primary">
                Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
