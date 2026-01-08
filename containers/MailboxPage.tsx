
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { GoogleGenAI, Type } from '@google/genai';
import { TicketCategory, TicketPriority } from '../types';
import { SparklesIcon } from '../components/icons';

const MailboxPage: React.FC = () => {
    const { users, addTicket } = useData();
    const [emailContent, setEmailContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleParseEmail = async () => {
        if (!emailContent.trim()) {
            setError('Email content cannot be empty.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    userEmail: { type: Type.STRING, description: "The sender's email address." },
                    subject: { type: Type.STRING, description: 'The subject of the ticket.' },
                    description: { type: Type.STRING, description: 'The detailed problem description from the email body.' },
                    priority: { type: Type.STRING, enum: Object.values(TicketPriority), description: 'The estimated priority.' },
                    category: { type: Type.STRING, enum: Object.values(TicketCategory), description: 'The most relevant ticket category.' },
                    triageSummary: { type: Type.STRING, description: 'A one-sentence summary of the problem and its urgency for an IT professional.' },
                    slaBreachRisk: { type: Type.STRING, enum: ['Low', 'Medium', 'High'], description: 'The risk of breaching an SLA based on urgency cues like "deadline", "urgent", "CEO", "widespread issue".' }
                },
                required: ['userEmail', 'subject', 'description', 'priority', 'category', 'triageSummary', 'slaBreachRisk']
            };

            const prompt = `Parse the following email content to create a support ticket. Identify the user's email, subject, and description. Infer the priority and category. Also, perform an initial triage: provide a one-sentence summary for the IT team and assess the SLA breach risk based on urgency cues.\n\nEmail Content:\n---\n${emailContent}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                },
            });

            const parsedData = JSON.parse(response.text);
            
            const user = users.find(u => u.email.toLowerCase() === parsedData.userEmail.toLowerCase());
            if (!user) {
                setError(`User with email "${parsedData.userEmail}" not found in the system.`);
                setIsLoading(false);
                return;
            }

            addTicket({
                subject: parsedData.subject,
                description: parsedData.description,
                user: { id: user.id, name: user.name, avatar: user.avatar },
                department: user.department,
                priority: parsedData.priority as TicketPriority,
                category: parsedData.category as TicketCategory,
                triageSummary: parsedData.triageSummary,
                slaBreachRisk: parsedData.slaBreachRisk,
            });
            
            setSuccessMessage(`Successfully created ticket for ${user.name} with AI Triage.`);
            setEmailContent('');

        } catch (e) {
            console.error(e);
            setError('Failed to parse email. The AI could not process the request. Please check the format and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl text-text-main font-bold">Mailbox (Email-to-Ticket)</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
                <h2 className="text-xl font-semibold text-text-main flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-primary" />
                    AI-Powered Ticket Creation & Triage
                </h2>
                <p className="text-sm text-text-light mt-1 mb-4">
                    Paste an email below. Our AI will automatically parse it, identify the user, categorize the issue, and perform an initial triage for urgency.
                </p>
                
                <textarea
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder={`Example:\n\nFrom: employee@example.com\nSubject: Help! Wi-Fi is down\n\nHi IT Team,\n\nI can't connect to the internet in the main conference room. My laptop doesn't see the "CorpNet" network at all.\n\nThanks,\nJane`}
                    rows={10}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:outline-none focus:ring-primary focus:border-primary font-mono text-sm"
                    disabled={isLoading}
                />

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleParseEmail}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Parsing Email...
                            </>
                        ) : (
                           'Create Ticket from Email'
                        )}
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mt-4">{error}</p>}
                {successMessage && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-md mt-4">{successMessage}</p>}
            </div>
        </div>
    );
};

export default MailboxPage;