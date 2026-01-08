
import React, { useState, useMemo } from 'react';
import TicketList from '../components/TicketList';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Ticket, TicketStatus, TicketPriority, UserRole } from '../types';
import Modal from '../components/Modal';
import CreateTicketForm from '../components/CreateTicketForm';
import TicketDetail from '../components/TicketDetail';

const TicketsPage: React.FC = () => {
    const { tickets, users, addTicket, updateTicket } = useData();
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
    const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const handleAddTicket = (newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'lastUpdate' | 'status'>) => {
        addTicket(newTicketData);
        setIsCreateModalOpen(false);
    };

    const handleUpdateTicket = (updatedTicket: Ticket) => {
      updateTicket(updatedTicket);
      setSelectedTicket(null);
    }

    const handleViewTicket = (ticket: Ticket) => {
      setSelectedTicket(ticket);
    }

    const filteredTickets = useMemo(() => {
        let displayTickets = tickets;
        // If the user is an employee, only show their tickets.
        if (currentUser && currentUser.role === UserRole.Employee) {
            displayTickets = tickets.filter(ticket => ticket.user.id === currentUser.id);
        }

        return displayTickets
            .filter(ticket => statusFilter === 'all' || ticket.status === statusFilter)
            .filter(ticket => priorityFilter === 'all' || ticket.priority === priorityFilter)
            .filter(ticket => 
                ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [tickets, searchTerm, statusFilter, priorityFilter, currentUser]);

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl text-text-main font-bold">Tickets</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
          >
              <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Ticket
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
                      placeholder="Search by subject, ID, user..."
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
                      onChange={e => setStatusFilter(e.target.value as TicketStatus | 'all')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                      <option value="all">All Statuses</option>
                      {Object.values(TicketStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-text-light">Priority</label>
                  <select 
                      id="priority"
                      value={priorityFilter}
                      onChange={e => setPriorityFilter(e.target.value as TicketPriority | 'all')}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                      <option value="all">All Priorities</option>
                      {Object.values(TicketPriority).map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                      ))}
                  </select>
              </div>
              <div className="flex items-end">
                  <button className="bg-gray-200 hover:bg-gray-300 text-text-main font-bold py-2 px-4 rounded-lg w-full transition-colors duration-200" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPriorityFilter('all'); }}>
                      Clear Filters
                  </button>
              </div>
          </div>
        </div>

        {/* Ticket List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <TicketList tickets={filteredTickets} onViewTicket={handleViewTicket} />
        </div>
      </div>
      
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Ticket">
          <CreateTicketForm onSubmit={handleAddTicket} users={users} />
      </Modal>

      {selectedTicket && (
        <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket Details - ${selectedTicket.id}`}>
          <TicketDetail ticket={selectedTicket} onUpdate={handleUpdateTicket} />
        </Modal>
      )}
    </>
  );
};

export default TicketsPage;
