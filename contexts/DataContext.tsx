import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Ticket, Asset, User, TicketStatus, KnowledgeBaseArticle } from '../types';
import { tickets as mockTickets, assets as mockAssets, users as mockUsers, knowledgeBaseArticles as mockKB } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';


interface DataContextType {
  tickets: Ticket[];
  assets: Asset[];
  users: User[];
  knowledgeBaseArticles: KnowledgeBaseArticle[];
  addTicket: (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'lastUpdate' | 'status' | 'conversations'>) => void;
  updateTicket: (updatedTicket: Ticket) => void;
  addAsset: (assetData: Omit<Asset, 'id'>) => void;
  updateAsset: (updatedAsset: Asset) => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (updatedUser: User) => void;
  addKbArticle: (articleData: Omit<KnowledgeBaseArticle, 'id' | 'createdAt' | 'lastUpdate'>) => void;
  updateKbArticle: (updatedArticle: KnowledgeBaseArticle) => void;
  setTickets: (tickets: Ticket[]) => void;
  setAssets: (assets: Asset[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('tickets', mockTickets);
  const [assets, setAssets] = useLocalStorage<Asset[]>('assets', mockAssets);
  const [users, setUsers] = useLocalStorage<User[]>('users', mockUsers);
  const [knowledgeBaseArticles, setKnowledgeBaseArticles] = useLocalStorage<KnowledgeBaseArticle[]>('kb_articles', mockKB);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'lastUpdate' | 'status' | 'conversations'>) => {
    const newTicket: Ticket = {
      id: `TICK-${String(Date.now()).slice(-4)}`,
      ...ticketData,
      status: TicketStatus.Open,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      conversations: [],
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? { ...updatedTicket, lastUpdate: new Date().toISOString() } : t));
  };
  
  const addAsset = (assetData: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
        id: `ASSET-${String(Date.now()).slice(-4)}`,
        ...assetData,
    };
    setAssets(prev => [newAsset, ...prev]);
  };

  const updateAsset = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
        id: `USR-${String(Date.now()).slice(-4)}`,
        ...userData
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const addKbArticle = (articleData: Omit<KnowledgeBaseArticle, 'id' | 'createdAt' | 'lastUpdate'>) => {
    const newArticle: KnowledgeBaseArticle = {
        id: `KB-${String(Date.now()).slice(-4)}`,
        ...articleData,
        createdAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
    };
    setKnowledgeBaseArticles(prev => [newArticle, ...prev]);
  };

  const updateKbArticle = (updatedArticle: KnowledgeBaseArticle) => {
      setKnowledgeBaseArticles(prev => prev.map(a => a.id === updatedArticle.id ? { ...updatedArticle, lastUpdate: new Date().toISOString() } : a));
  };


  return (
    <DataContext.Provider value={{ tickets, assets, users, knowledgeBaseArticles, addTicket, updateTicket, addAsset, updateAsset, addUser, updateUser, addKbArticle, updateKbArticle, setTickets, setAssets }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};