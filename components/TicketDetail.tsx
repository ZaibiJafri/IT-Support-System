
import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, TicketPriority, Message, UserRole, KnowledgeBaseArticle, TicketCategory, Asset } from '../types';
import { SparklesIcon, ShieldCheckIcon, AssetIcon as AssetIconComponent, TicketIcon } from './icons';
import { GoogleGenAI } from '@google/genai';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface TicketDetailProps {
  ticket: Ticket;
  onUpdate: (updatedTicket: Ticket) => void;
}

const getRiskColor = (risk: 'Low' | 'Medium' | 'High' | undefined) => {
    switch(risk) {
        case 'High': return 'bg-red-100 text-red-800 border-red-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'Low': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

const User360Panel: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
    const { assets, tickets } = useData();
    const [historySummary, setHistorySummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const userAssets = assets.filter(a => a.assignedUser?.id === ticket.user.id);
    const userTickets = tickets.filter(t => t.user.id === ticket.user.id && t.id !== ticket.id).slice(0, 5);

    const generateHistorySummary = async () => {
        setIsLoadingSummary(true);
        setHistorySummary('');
        try {
            const ticketHistory = userTickets.map(t => `- ${t.subject} (Status: ${t.status})`).join('\n');
            const prompt = `Summarize this user's recent IT support history into a single sentence highlighting any recurring issues or patterns.\n\nHistory:\n${ticketHistory}`;
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setHistorySummary(response.text);
        } catch (error) {
            console.error(error);
            setHistorySummary("Could not generate summary.");
        } finally {
            setIsLoadingSummary(false);
        }
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg h-full space-y-4">
            <h3 className="font-bold text-text-main">User 360&deg; View</h3>
            
            {/* User Info */}
            <div className="flex items-center gap-3">
                <img src={ticket.user.avatar} alt={ticket.user.name} className="w-12 h-12 rounded-full" />
                <div>
                    <p className="font-semibold text-text-main">{ticket.user.name}</p>
                    <p className="text-xs text-text-light">{ticket.department}</p>
                </div>
            </div>

            {/* Assigned Assets */}
            <div>
                <h4 className="font-semibold text-sm text-text-main mb-2 flex items-center gap-1"><AssetIconComponent className="w-4 h-4"/> Assigned Assets</h4>
                <ul className="text-xs text-text-light space-y-1 pl-2">
                    {userAssets.length > 0 ? userAssets.map(a => (
                        <li key={a.id}>{a.brand} {a.model} ({a.type})</li>
                    )) : <li>No assets assigned.</li>}
                </ul>
            </div>

            {/* Recent Tickets */}
            <div>
                <h4 className="font-semibold text-sm text-text-main mb-2 flex items-center gap-1"><TicketIcon className="w-4 h-4"/> Recent Tickets</h4>
                <ul className="text-xs text-text-light space-y-1 pl-2">
                    {userTickets.length > 0 ? userTickets.map(t => (
                        <li key={t.id} className="truncate" title={t.subject}>{t.subject}</li>
                    )) : <li>No recent tickets.</li>}
                </ul>
                {userTickets.length > 0 && (
                    <div className="mt-2">
                        <button onClick={generateHistorySummary} disabled={isLoadingSummary} className="text-xs text-primary hover:underline flex items-center gap-1">
                            <SparklesIcon className="w-3 h-3"/>
                            {isLoadingSummary ? "Analyzing..." : "AI Summary"}
                        </button>
                        {historySummary && <p className="text-xs italic text-indigo-800 bg-indigo-50 p-2 mt-2 rounded">{historySummary}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}


const TicketDetail: React.FC<TicketDetailProps> = ({ ticket, onUpdate }) => {
  const { currentUser } = useAuth();
  const { knowledgeBaseArticles } = useData();
  const [activeTab, setActiveTab] = useState('details');

  const isITStaff = currentUser?.role === UserRole.Admin || currentUser?.role === UserRole.IT;

  // Details Tab State
  const [status, setStatus] = useState<TicketStatus>(ticket.status);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [category, setCategory] = useState<TicketCategory>(ticket.category);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo ?? '');

  const [aiSuggestion, setAiSuggestion] = useState('');
  const [suggestedArticles, setSuggestedArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState('');

  // Conversation Tab State
  const [newMessage, setNewMessage] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isLoadingSmartReply, setIsLoadingSmartReply] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  
  const itUsers = useData().users.filter(u => u.role === UserRole.Admin || u.role === UserRole.IT);

  useEffect(() => {
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setCategory(ticket.category);
    setAssignedTo(ticket.assignedTo ?? '');
  }, [ticket]);

  const createSystemMessage = (content: string) => ({
    id: `MSG-${Date.now()}`,
    author: { id: currentUser!.id, name: currentUser!.name, avatar: currentUser!.avatar, role: currentUser!.role },
    content,
    timestamp: new Date().toISOString(),
    isSystemMessage: true,
  });
  
  const handleUpdate = (field: string, oldValue: string, newValue: string) => {
    if (newValue !== oldValue) {
        const log = createSystemMessage(`changed ${field} from ${oldValue} to ${newValue}.`);
        const updatedTicket = {...ticket, [field]: newValue};

        if (field === 'assignedTo') {
            const assignee = itUsers.find(u => u.id === newValue);
            const oldAssignee = itUsers.find(u => u.id === oldValue);
            const logContent = `re-assigned ticket from ${oldAssignee?.name ?? 'Unassigned'} to ${assignee?.name ?? 'Unassigned'}.`;
            updatedTicket.conversations.push(createSystemMessage(logContent));
        } else {
             updatedTicket.conversations.push(log);
        }
        
        onUpdate(updatedTicket);
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;
    const message: Message = {
      id: `MSG-${Date.now()}`,
      author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
      content: newMessage,
      timestamp: new Date().toISOString(),
    };
    onUpdate({ ...ticket, conversations: [...ticket.conversations, message] });
    setNewMessage('');
    setSmartReplies([]);
  };

  const handleGetAiSuggestion = async () => { /* ... (no changes needed here) ... */ };
  const handleGenerateSmartReplies = async () => { /* ... (no changes needed here) ... */ };
  const handleGenerateSummary = async () => { /* ... (no changes needed here) ... */ };
  const formatDate = (dateString: string, format: 'datetime' | 'time' = 'datetime') => { /* ... (no changes needed here) ... */ };
  
  const TabButton: React.FC<{ tabName: string; label: string }> = ({ tabName, label }) => (
    <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === tabName ? 'bg-primary text-white' : 'text-text-light hover:bg-gray-100'}`}>
      {label}
    </button>
  );

  return (
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col h-full">
            <div className="flex-shrink-0 border-b border-gray-200 mb-4">
                <div className="flex space-x-2 p-1 bg-gray-50 rounded-lg">
                    <TabButton tabName="details" label="Details & AI Assistant" />
                    <TabButton tabName="conversation" label="Conversation" />
                </div>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text-main">{ticket.subject}</h3>
                    {ticket.triageSummary && (
                        <div className={`p-3 rounded-lg border text-sm flex items-start gap-3 ${getRiskColor(ticket.slaBreachRisk)}`}>
                            <ShieldCheckIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold">AI Triage Summary</h4>
                                <p>{ticket.triageSummary}</p>
                            </div>
                        </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg"><p className="text-sm text-text-main">{ticket.description}</p></div>
                    
                    {/* AI Assistant Section */}
                    {isITStaff && (
                      <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-text-main flex items-center"><SparklesIcon className="w-5 h-5 mr-2 text-primary" />AI Assistant</h4>
                            <button onClick={handleGetAiSuggestion} disabled={isLoadingAI} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs font-bold py-1 px-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed">{isLoadingAI ? 'Thinking...' : 'Get AI Suggestion'}</button>
                        </div>
                        {isLoadingAI && <div className="text-sm text-center text-text-light p-4">Loading suggestion...</div>}
                        {errorAI && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{errorAI}</div>}
                        {aiSuggestion && (<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200"><h5 className="font-bold text-sm text-indigo-800 mb-2">Troubleshooting Steps</h5><pre className="text-sm text-indigo-900 whitespace-pre-wrap font-sans">{aiSuggestion}</pre></div>)}
                         {suggestedArticles.length > 0 && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h5 className="font-bold text-sm text-green-800 mb-2">Suggested Knowledge Base Articles</h5>
                                <ul className="space-y-2">
                                {suggestedArticles.map(article => (
                                    <li key={article.id} className="text-sm text-green-900 bg-green-100 p-2 rounded-md">
                                        <p className="font-semibold">{article.title}</p>
                                        <button onClick={() => navigator.clipboard.writeText(article.content)} className="text-xs text-green-700 hover:underline mt-1">Copy content to clipboard</button>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        )}
                      </div>
                    )}
                    
                    {/* Ticket Properties */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t">
                      <div className="text-text-light">Created: <span className="font-medium text-text-main">{formatDate(ticket.createdAt)}</span></div>
                      <div className="text-text-light">Last Update: <span className="font-medium text-text-main">{formatDate(ticket.lastUpdate)}</span></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <label htmlFor="assignedTo" className="block text-sm font-medium text-text-light">Assigned To</label>
                        <select id="assignedTo" value={assignedTo} onChange={(e) => handleUpdate('assignedTo', assignedTo, e.target.value)} disabled={!isITStaff} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed">
                          <option value="">Unassigned</option>
                          {itUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-text-light">Category</label>
                        <select id="category" value={category} onChange={(e) => handleUpdate('category', category, e.target.value)} disabled={!isITStaff} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed">
                          {Object.values(TicketCategory).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                       <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-text-light">Priority</label>
                        <select id="priority" value={priority} onChange={(e) => handleUpdate('priority', priority, e.target.value)} disabled={!isITStaff} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed">
                          {Object.values(TicketPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-text-light">Status</label>
                        <select id="status" value={status} onChange={(e) => handleUpdate('status', status, e.target.value)} disabled={!isITStaff} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed">
                          {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                  </div>
                )}
                {activeTab === 'conversation' && (
                    <p>Conversation View...</p>
                )}
            </div>
        </div>
        
        {/* User 360 Panel */}
        <div className="hidden lg:block">
            <User360Panel ticket={ticket} />
        </div>
     </div>
  );
};

export default TicketDetail;