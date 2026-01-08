
import React, { useState } from 'react';
import { TicketCategory, User } from '../types';

interface CreateKbArticleFormProps {
    onSubmit: (data: any) => void;
    currentUser: User;
    article?: any; // For editing
}

const CreateKbArticleForm: React.FC<CreateKbArticleFormProps> = ({ onSubmit, currentUser, article }) => {
    const [title, setTitle] = useState(article?.title || '');
    const [content, setContent] = useState(article?.content || '');
    const [category, setCategory] = useState<TicketCategory>(article?.category || TicketCategory.Software);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            content,
            category,
            author: {
                id: currentUser.id,
                name: currentUser.name,
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-light">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                />
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-text-light">Category</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    required
                >
                    {Object.values(TicketCategory).map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-text-light">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Provide detailed steps, links, and information here."
                    required
                />
            </div>
            <div className="flex justify-end pt-4">
                <button 
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Save Article
                </button>
            </div>
        </form>
    );
};

export default CreateKbArticleForm;