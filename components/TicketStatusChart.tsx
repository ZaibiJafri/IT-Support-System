
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Ticket, TicketStatus } from '../types';

interface TicketStatusChartProps {
  data: Ticket[];
}

const TicketStatusChart: React.FC<TicketStatusChartProps> = ({ data }) => {
  const statusCounts = data.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<TicketStatus, number>);

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    tickets: value,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-96">
      <h3 className="text-lg font-semibold text-text-main mb-4">Tickets by Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
          <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}} contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
          <Legend wrapperStyle={{fontSize: "14px"}}/>
          <Bar dataKey="tickets" fill="#3B82F6" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TicketStatusChart;
