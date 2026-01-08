
import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import { useData } from '../contexts/DataContext';
import { TicketStatus, Ticket, UserRole } from '../types';
import { TicketIcon, AssetIcon, LightBulbIcon } from '../components/icons';
import Modal from '../components/Modal';
import TicketDetail from '../components/TicketDetail';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { GoogleGenAI } from '@google/genai';


const Dashboard: React.FC = () => {
  const { tickets, assets, users, updateTicket } = useData();
  const { currentUser } = useAuth();
  const [selectedTicket, setSelectedTicket] = React.useState<Ticket | null>(null);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchDashboardInsights = async () => {
        setIsLoadingInsight(true);
        try {
            const recentTickets = tickets.slice(0, 20).map(t => ({
                subject: t.subject,
                category: t.category,
                createdAt: t.createdAt,
                priority: t.priority
            }));

            if (recentTickets.length < 3) {
                setAiInsight("Not enough recent ticket data to generate insights.");
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `As an IT Director, analyze the following recent support ticket data. Identify one emerging trend, a potential widespread issue, or a key area for improvement. Provide a concise, one-sentence summary of the trend and a one-sentence proactive action to address it.\n\nData:\n${JSON.stringify(recentTickets)}`;

            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setAiInsight(response.text);

        } catch (error) {
            console.error("Failed to fetch AI insights:", error);
            setAiInsight("Could not retrieve AI insights at this time.");
        } finally {
            setIsLoadingInsight(false);
        }
    };
    fetchDashboardInsights();
  }, [tickets]);


  const openTickets = tickets.filter(t => t.status === TicketStatus.Open).length;
  
  const closedTickets = tickets.filter(t => t.status === TicketStatus.Closed);
  const totalResolutionTime = closedTickets.reduce((acc, t) => {
      const created = new Date(t.createdAt).getTime();
      const closed = new Date(t.lastUpdate).getTime();
      return acc + (closed - created);
  }, 0);
  const avgResolutionHours = closedTickets.length > 0 ? (totalResolutionTime / closedTickets.length / (1000 * 60 * 60)).toFixed(1) : 'N/A';

  const ticketVolumeData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = tickets.filter(t => t.createdAt.startsWith(dateStr)).length;
    return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), count };
  }).reverse();

  const itUsers = users.filter(u => u.role === UserRole.Admin || u.role === UserRole.IT);
  const solverStats = itUsers.map(user => {
    const solvedCount = tickets.filter(t => t.status === TicketStatus.Closed && t.conversations.some(c => c.author.id === user.id && !c.isSystemMessage)).length;
    return { name: user.name.split(' ')[0], ticketsSolved: solvedCount, avatar: user.avatar };
  }).sort((a,b) => b.ticketsSolved - a.ticketsSolved).slice(0, 3);
  
  const handleViewTicket = (ticket: Ticket) => setSelectedTicket(ticket);
  const handleCloseModal = () => setSelectedTicket(null);
  const handleUpdateTicket = (updatedTicket: Ticket) => updateTicket(updatedTicket);

  return (
    <>
      <div className="space-y-8">
        <div className="relative bg-primary p-6 rounded-lg overflow-hidden">
          <div className="absolute right-0 top-0 -mt-4 -mr-16 pointer-events-none"><svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="url(#paint0_linear_1_2)"/><defs><linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0.05"/><stop offset="1" stopColor="white" stopOpacity="0.0"/></linearGradient></defs></svg></div>
          <div className="relative">
            <h1 className="text-2xl md:text-3xl text-white font-bold mb-2">Good Morning, {currentUser?.name.split(' ')[0]}!</h1>
            <p className="text-blue-100">Here's your IT performance overview for today.</p>
          </div>
        </div>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard title="Open Tickets" value={openTickets} icon={<TicketIcon className="w-6 h-6 text-blue-500" />} color="bg-blue-100"/>
          <DashboardCard title="Avg. Resolution" value={`${avgResolutionHours} hrs`} icon={<svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-100"/>
          <DashboardCard title="Tickets Today" value={ticketVolumeData[6].count} icon={<TicketIcon className="w-6 h-6 text-indigo-500" />} color="bg-indigo-100"/>
          <DashboardCard title="Total Assets" value={assets.length} icon={<AssetIcon className="w-6 h-6 text-yellow-500" />} color="bg-yellow-100"/>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-full"><LightBulbIcon className="w-6 h-6 text-purple-600"/></div>
            <div>
                <h3 className="text-lg font-semibold text-text-main">AI-Powered Insights</h3>
                {isLoadingInsight ? (
                    <p className="text-sm text-text-light animate-pulse">Analyzing recent activity...</p>
                ) : (
                    <p className="text-sm text-text-light whitespace-pre-wrap font-sans">{aiInsight}</p>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md h-96">
            <h3 className="text-lg font-semibold text-text-main mb-4">Ticket Volume (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={ticketVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                <Legend wrapperStyle={{fontSize: "14px"}}/>
                <Line type="monotone" dataKey="count" name="New Tickets" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-text-main mb-4">Top Ticket Solvers</h3>
            <ul className="space-y-4">
                {solverStats.map((solver, index) => (
                    <li key={solver.name} className="flex items-center">
                       <img className="h-10 w-10 rounded-full object-cover" src={solver.avatar} alt={solver.name} />
                       <div className="ml-3">
                           <p className="text-sm font-medium text-text-main">{solver.name}</p>
                           <p className="text-xs text-text-light">{solver.ticketsSolved} tickets solved</p>
                       </div>
                       <div className="ml-auto text-sm font-bold text-gray-500">#{index + 1}</div>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={handleCloseModal} title={`Ticket Details - ${selectedTicket.id}`}>
          <TicketDetail ticket={selectedTicket} onUpdate={handleUpdateTicket} />
        </Modal>
      )}
    </>
  );
};

export default Dashboard;