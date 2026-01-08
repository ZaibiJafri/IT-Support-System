
import React from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  onViewTicket: (ticket: Ticket) => void;
}

const getPriorityClass = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.High: return 'bg-red-100 text-red-800';
      case TicketPriority.Medium: return 'bg-yellow-100 text-yellow-800';
      case TicketPriority.Low: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusClass = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Open: return 'bg-blue-100 text-blue-800';
      case TicketStatus.InProgress: return 'bg-purple-100 text-purple-800';
      case TicketStatus.SentToRepair: return 'bg-orange-100 text-orange-800';
      case TicketStatus.Closed: return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
};
  
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onViewTicket }) => {

  if (tickets.length === 0) {
    return (
      <div className="text-center p-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-text-main">No tickets found</h3>
        <p className="mt-1 text-sm text-text-light">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
        {/* Mobile Card View */}
        <div className="md:hidden">
            <div className="px-4 py-4 space-y-4">
            {tickets.map(ticket => (
                <div key={ticket.id} className="bg-white p-4 rounded-lg shadow ring-1 ring-black ring-opacity-5">
                    <div className="flex items-center justify-between">
                         <p className="text-sm font-semibold text-primary truncate">{ticket.subject}</p>
                         <button onClick={() => onViewTicket(ticket)} className="text-primary hover:text-primary-dark text-sm font-medium">View</button>
                    </div>
                    <p className="text-xs text-text-light mt-1">{ticket.id}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                             <img className="h-8 w-8 rounded-full object-cover" src={ticket.user.avatar} alt={ticket.user.name} />
                             <div>
                                 <p className="text-sm font-medium text-text-main">{ticket.user.name}</p>
                                 <p className="text-xs text-text-light">{ticket.department}</p>
                             </div>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                            {ticket.status}
                        </span>
                    </div>
                     <div className="mt-2 pt-2 border-t flex justify-between items-center">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(ticket.priority)}`}>
                            {ticket.priority} Priority
                        </span>
                        <p className="text-xs text-text-light">Updated: {formatDate(ticket.lastUpdate)}</p>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Last Update</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={ticket.user.avatar} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-text-main">{ticket.user.name}</div>
                        <div className="text-sm text-text-light">{ticket.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-sm">
                    <div className="text-sm text-text-main truncate font-medium">{ticket.subject}</div>
                    <div className="text-sm text-text-light">{ticket.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityClass(ticket.priority)}`}>
                          {ticket.priority}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-light">{formatDate(ticket.lastUpdate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onViewTicket(ticket)} className="text-primary hover:text-primary-dark">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

export default TicketList;