
import React from 'react';
import { useData } from '../contexts/DataContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TicketPriority, TicketCategory } from '../types';

const ReportsPage: React.FC = () => {
  const { tickets } = useData();

  const priorityData = Object.values(TicketPriority).map(priority => ({
      name: priority,
      value: tickets.filter(t => t.priority === priority).length,
  }));
  
  const categoryData = Object.values(TicketCategory).map(category => ({
      name: category,
      value: tickets.filter(t => t.category === category).length,
  }));

  const PRIORITY_COLORS = {
    [TicketPriority.High]: '#EF4444',
    [TicketPriority.Medium]: '#F59E0B',
    [TicketPriority.Low]: '#10B981',
  };
  
  const CATEGORY_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F97316', '#6B7280'];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl md:text-3xl text-text-main font-bold">Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tickets by Priority */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-main mb-4">Tickets by Priority</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tickets by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-text-main mb-4">Tickets by Category</h3>
           <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;