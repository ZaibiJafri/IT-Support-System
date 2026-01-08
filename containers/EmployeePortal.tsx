
import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import TicketList from '../components/TicketList';
import Modal from '../components/Modal';
import CreateTicketForm from '../components/CreateTicketForm';
import TicketDetail from '../components/TicketDetail';

const EmployeePortal: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { tickets, users, addTicket, updateTicket } = useData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const myTickets = useMemo(() => {
    if (!currentUser) return [];
    return tickets.filter(ticket => ticket.user.id === currentUser.id).sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
  }, [tickets, currentUser]);
  
  const handleUpdateTicket = (updatedTicket: Ticket) => {
      updateTicket(updatedTicket);
      // Keep the modal open after update to see conversation history
      setSelectedTicket(prev => prev ? {...prev, ...updatedTicket} : null);
  }

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };
  
  // A simplified form for employees that doesn't ask them to select a user.
  const handleEmployeeAddTicket = (data: any) => {
      if (!currentUser) return;
      const fullTicketData = {
          ...data,
          user: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
          department: currentUser.department,
          conversations: [],
      };
      addTicket(fullTicketData);
      setIsCreateModalOpen(false);
  }

  if (!currentUser) {
    return null; // Should be handled by App router
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor"/></svg>
                <h1 className="text-xl font-bold text-text-main">My Support Tickets</h1>
              </div>
              <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                    <img className="h-9 w-9 rounded-full object-cover" src={currentUser.avatar} alt="User" />
                    <div>
                        <div className="font-semibold text-text-main text-sm">{currentUser.name}</div>
                        <div className="text-xs text-text-light">{currentUser.department}</div>
                    </div>
                </div>
                <button onClick={logout} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-text-main">My Tickets ({myTickets.length})</h2>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Ticket
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <TicketList tickets={myTickets} onViewTicket={handleViewTicket} />
            </div>
          </div>
        </main>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Ticket">
        {/* We pass a limited user list to the form for this view */}
        <CreateTicketForm onSubmit={handleEmployeeAddTicket} users={[currentUser]} />
      </Modal>

      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket Details - ${selectedTicket.id}`}>
          <TicketDetail ticket={selectedTicket} onUpdate={handleUpdateTicket} />
        </Modal>
      )}
    </>
  );
};

export default EmployeePortal;
