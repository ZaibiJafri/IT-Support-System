
import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import DashboardCard from '../components/DashboardCard';
import { Ticket, TicketStatus } from '../types';
import { ClipboardListIcon, TicketIcon } from '../components/icons';
import TicketList from '../components/TicketList';
import Modal from '../components/Modal';
import TicketDetail from '../components/TicketDetail';

const SupportDashboard: React.FC = () => {
    const { currentUser } = useAuth();
    const { tickets, updateTicket } = useData();
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const myTickets = useMemo(() => {
        return tickets.filter(t => t.assignedTo === currentUser?.id);
    }, [tickets, currentUser]);

    const myOpenTickets = myTickets.filter(t => t.status === TicketStatus.Open || t.status === TicketStatus.InProgress).length;
    const myClosedTickets = myTickets.filter(t => t.status === TicketStatus.Closed);
    
    // Calculate Personal Avg Resolution Time
    const totalResolutionTime = myClosedTickets.reduce((acc, t) => {
        const created = new Date(t.createdAt).getTime();
        const closed = new Date(t.lastUpdate).getTime();
        return acc + (closed - created);
    }, 0);
    const avgResolutionHours = myClosedTickets.length > 0 ? (totalResolutionTime / myClosedTickets.length / (1000 * 60 * 60)).toFixed(1) : 'N/A';

    const handleViewTicket = (ticket: Ticket) => setSelectedTicket(ticket);
    const handleCloseModal = () => setSelectedTicket(null);
    const handleUpdateTicket = (updatedTicket: Ticket) => updateTicket(updatedTicket);

    return (
        <>
        <div className="space-y-8">
            <div className="relative bg-primary p-6 rounded-lg overflow-hidden">
                <div className="absolute right-0 top-0 -mt-4 -mr-16 pointer-events-none"><svg width="250" height="250" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="100" cy="100" r="100" fill="url(#paint0_linear_1_2)"/><defs><linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse"><stop stopColor="white" stopOpacity="0.05"/><stop offset="1" stopColor="white" stopOpacity="0.0"/></linearGradient></defs></svg></div>
                <div className="relative">
                    <h1 className="text-2xl md:text-3xl text-white font-bold mb-2">My Workload</h1>
                    <p className="text-blue-100">Welcome back, {currentUser?.name.split(' ')[0]}! Here are your assigned tickets.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <DashboardCard title="My Open Tickets" value={myOpenTickets} icon={<TicketIcon className="w-6 h-6 text-blue-500" />} color="bg-blue-100"/>
                <DashboardCard title="My Avg. Resolution" value={`${avgResolutionHours} hrs`} icon={<svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-100"/>
                <DashboardCard title="My Total Tickets" value={myTickets.length} icon={<ClipboardListIcon className="w-6 h-6 text-indigo-500" />} color="bg-indigo-100"/>
            </div>

             <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <h3 className="text-lg font-semibold text-text-main p-4 border-b">My Assigned Open Tickets</h3>
                <TicketList tickets={myTickets.filter(t => t.status !== TicketStatus.Closed)} onViewTicket={handleViewTicket} />
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

export default SupportDashboard;
