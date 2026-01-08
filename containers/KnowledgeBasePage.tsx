
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { TicketCategory, KnowledgeBaseArticle } from '../types';
import Modal from '../components/Modal';
import CreateKbArticleForm from '../components/CreateKbArticleForm';
import { useAuth } from '../contexts/AuthContext';

const KnowledgeBasePage: React.FC = () => {
    const { knowledgeBaseArticles, addKbArticle, updateKbArticle } = useData();
    const { currentUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<TicketCategory | 'all'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);

    const filteredArticles = useMemo(() => {
        return knowledgeBaseArticles
            .filter(article => categoryFilter === 'all' || article.category === categoryFilter)
            .filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.content.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [knowledgeBaseArticles, searchTerm, categoryFilter]);
    
    const handleAddArticle = (data: Omit<KnowledgeBaseArticle, 'id' | 'createdAt' | 'lastUpdate'>) => {
        addKbArticle(data);
        setIsCreateModalOpen(false);
    }
    
    const handleUpdateArticle = (data: KnowledgeBaseArticle) => {
        updateKbArticle(data);
        setSelectedArticle(null);
    }

    return (
        <>
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl md:text-3xl text-text-main font-bold">Knowledge Base</h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-4 sm:mt-0 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Create Article
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                        <label htmlFor="search" className="block text-sm font-medium text-text-light">Search Articles</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by title or content..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-text-light">Category</label>
                        <select
                            id="category"
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value as TicketCategory | 'all')}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                            <option value="all">All Categories</option>
                            {Object.values(TicketCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.length > 0 ? filteredArticles.map(article => (
                    <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 self-start`}>
                            {article.category}
                        </span>
                        <h3 className="text-lg font-bold text-text-main mt-2">{article.title}</h3>
                        <p className="text-sm text-text-light mt-2 flex-grow h-24 overflow-hidden">{article.content.substring(0, 150)}...</p>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                            <div className="text-xs text-gray-400">
                                By {article.author.name} <br/>
                                Updated {new Date(article.lastUpdate).toLocaleDateString()}
                            </div>
                             <button onClick={() => setSelectedArticle(article)} className="text-primary hover:text-primary-dark text-sm font-medium">Read More</button>
                        </div>
                    </div>
                )) : (
                     <div className="md:col-span-2 lg:col-span-3 text-center p-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-text-main">No articles found</h3>
                        <p className="mt-1 text-sm text-text-light">Try adjusting your search or filters.</p>
                        <button onClick={() => setIsCreateModalOpen(true)} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg text-sm">Create Article</button>
                    </div>
                )}
            </div>
        </div>

        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New KB Article">
            <CreateKbArticleForm 
                onSubmit={handleAddArticle} 
                currentUser={currentUser!}
            />
        </Modal>

        {selectedArticle && (
            <Modal isOpen={!!selectedArticle} onClose={() => setSelectedArticle(null)} title={selectedArticle.title}>
                <div className="space-y-4">
                    <pre className="text-text-main whitespace-pre-wrap font-sans text-sm">{selectedArticle.content}</pre>
                    <div className="text-xs text-gray-400 pt-4 border-t">
                        Category: {selectedArticle.category}<br/>
                        Author: {selectedArticle.author.name}<br/>
                        Last Updated: {new Date(selectedArticle.lastUpdate).toLocaleString()}
                    </div>
                </div>
            </Modal>
        )}
        </>
    );
};

export default KnowledgeBasePage;