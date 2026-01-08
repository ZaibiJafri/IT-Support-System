
import { Ticket, TicketStatus, TicketPriority, User, UserRole, UserStatus, Asset, AssetStatus, AssetType, TicketCategory, KnowledgeBaseArticle } from '../types';

export const users: User[] = [
    { id: 'USR-001', name: 'Alexandre Monet', email: 'admin@example.com', role: UserRole.Admin, status: UserStatus.Active, department: 'IT', avatar: 'https://picsum.photos/id/237/200/200', password: 'password' },
    { id: 'USR-002', name: 'Jane Doe', email: 'employee@example.com', role: UserRole.Employee, status: UserStatus.Active, department: 'Finance', avatar: 'https://picsum.photos/id/1/200/200', password: 'password' },
    { id: 'USR-003', name: 'John Smith', email: 'support@example.com', role: UserRole.IT, status: UserStatus.Active, department: 'IT', avatar: 'https://picsum.photos/id/2/200/200', password: 'password' },
    { id: 'USR-004', name: 'Emily White', email: 'emily.w@example.com', role: UserRole.Employee, status: UserStatus.Active, department: 'Sales', avatar: 'https://picsum.photos/id/3/200/200', password: 'password' },
    { id: 'USR-005', name: 'Michael Brown', email: 'hr@example.com', role: UserRole.HR, status: UserStatus.Active, department: 'HR', avatar: 'https://picsum.photos/id/4/200/200', password: 'password' },
    { id: 'USR-006', name: 'Sarah Green', email: 'sarah.g@example.com', role: UserRole.Employee, status: UserStatus.Inactive, department: 'Operations', avatar: 'https://picsum.photos/id/5/200/200', password: 'password' },
    { id: 'USR-007', name: 'David Lee', email: 'david.l@example.com', role: UserRole.IT, status: UserStatus.Active, department: 'IT', avatar: 'https://picsum.photos/id/6/200/200', password: 'password' },
    { id: 'USR-008', name: 'Laura Wilson', email: 'laura.w@example.com', role: UserRole.Employee, status: UserStatus.Active, department: 'Finance', avatar: 'https://picsum.photos/id/7/200/200', password: 'password' },
    { id: 'USR-009', name: 'Chris Evans', email: 'chris.e@example.com', role: UserRole.Employee, status: UserStatus.Active, department: 'Management', avatar: 'https://picsum.photos/id/8/200/200', password: 'password' },
];

export const tickets: Ticket[] = [
  {
    id: 'TICK-001',
    subject: 'Printer in Finance Dept is not working',
    description: 'The main printer on the 2nd floor is showing a "Paper Jam" error, but there is no paper stuck inside. We have tried restarting it multiple times.',
    user: { id: 'USR-002', name: 'Jane Doe', avatar: 'https://picsum.photos/id/1/200/200' },
    department: 'Finance',
    priority: TicketPriority.High,
    status: TicketStatus.Open,
    category: TicketCategory.Hardware,
    createdAt: '2023-10-27T10:00:00Z',
    lastUpdate: '2023-10-27T11:05:00Z',
    assignedTo: 'USR-003',
    conversations: [
        { id: 'MSG-001', author: { id: 'USR-003', name: 'John Smith', avatar: 'https://picsum.photos/id/2/200/200', role: UserRole.IT }, content: 'Hi Jane, I\'m looking into this now. Have you tried checking the rear access panel for any small torn pieces of paper?', timestamp: '2023-10-27T10:05:00Z' },
        { id: 'MSG-002', author: { id: 'USR-002', name: 'Jane Doe', avatar: 'https://picsum.photos/id/1/200/200', role: UserRole.Employee }, content: 'Hi John, yes we did. Nothing there. It makes a grinding noise when it tries to start printing.', timestamp: '2023-10-27T10:15:00Z' },
        { id: 'MSG-003', author: { id: 'USR-003', name: 'John Smith', avatar: 'https://picsum.photos/id/2/200/200', role: UserRole.IT }, content: 'Okay, thanks. I will come by in about 15 minutes to take a look myself.', timestamp: '2023-10-27T10:17:00Z' },
        { id: 'SYS-001', author: { id: 'USR-001', name: 'System', avatar: '', role: UserRole.Admin }, content: 'John Smith changed status to In Progress.', timestamp: '2023-10-27T11:05:00Z', isSystemMessage: true },
    ]
  },
  {
    id: 'TICK-002',
    subject: 'Request for new laptop charger',
    description: 'My current Dell laptop charger has stopped working. I need a replacement for a Dell XPS 15 model.',
    user: { id: 'USR-004', name: 'Emily White', avatar: 'https://picsum.photos/id/3/200/200' },
    department: 'Marketing',
    priority: TicketPriority.Medium,
    status: TicketStatus.InProgress,
    category: TicketCategory.Hardware,
    createdAt: '2023-10-27T09:30:00Z',
    lastUpdate: '2023-10-27T11:45:00Z',
    assignedTo: 'USR-007',
    conversations: []
  },
  {
    id: 'TICK-003',
    subject: 'Outlook mail sync issue on mobile',
    description: 'My emails are not syncing on my iPhone. The Outlook app shows "Last updated yesterday". I have tried reinstalling the app.',
    user: { id: 'USR-004', name: 'Emily White', avatar: 'https://picsum.photos/id/3/200/200' },
    department: 'Sales',
    priority: TicketPriority.Low,
    status: TicketStatus.InProgress,
    category: TicketCategory.Software,
    createdAt: '2023-10-26T15:10:00Z',
    lastUpdate: '2023-10-27T08:20:00Z',
    assignedTo: 'USR-003',
    conversations: [
        { id: 'MSG-004', author: { id: 'USR-007', name: 'David Lee', avatar: 'https://picsum.photos/id/6/200/200', role: UserRole.IT }, content: 'Hi Emily, can you try removing and re-adding your mail account from the Outlook app settings?', timestamp: '2023-10-27T08:20:00Z' }
    ]
  },
  {
    id: 'TICK-004',
    subject: 'Laptop battery draining fast',
    description: 'My Lenovo ThinkPad battery only lasts for about an hour after a full charge. It used to last for 5-6 hours.',
    user: { id: 'USR-005', name: 'Michael Brown', avatar: 'https://picsum.photos/id/4/200/200' },
    department: 'HR',
    priority: TicketPriority.High,
    status: TicketStatus.SentToRepair,
    category: TicketCategory.Hardware,
    createdAt: '2023-10-25T11:00:00Z',
    lastUpdate: '2023-10-26T14:00:00Z',
    conversations: []
  },
  {
    id: 'TICK-005',
    subject: 'Password reset for SAP',
    description: 'I am unable to log in to SAP and I am not receiving the password reset email.',
    user: { id: 'USR-006', name: 'Sarah Green', avatar: 'https://picsum.photos/id/5/200/200' },
    department: 'Operations',
    priority: TicketPriority.Medium,
    status: TicketStatus.Closed,
    category: TicketCategory.AccountAccess,
    createdAt: '2023-10-26T18:00:00Z',
    lastUpdate: '2023-10-26T18:30:00Z',
    assignedTo: 'USR-007',
    conversations: []
  },
  {
    id: 'TICK-006',
    subject: 'Cannot connect to Wi-Fi on 3rd floor',
    description: 'The "CorpNet" Wi-Fi is not visible on my laptop when I am on the 3rd floor. It works fine on other floors.',
    user: { id: 'USR-007', name: 'David Lee', avatar: 'https://picsum.photos/id/6/200/200' },
    department: 'Engineering',
    priority: TicketPriority.High,
    status: TicketStatus.Open,
    category: TicketCategory.Network,
    createdAt: '2023-10-27T11:30:00Z',
    lastUpdate: '2023-10-27T11:30:00Z',
    assignedTo: 'USR-003',
    conversations: []
  },
   {
    id: 'TICK-007',
    subject: 'Microsoft Excel crashing on open',
    description: 'Whenever I open a specific file named "Q3_Report.xlsx", Microsoft Excel crashes. Other files work fine.',
    user: { id: 'USR-008', name: 'Laura Wilson', avatar: 'https://picsum.photos/id/7/200/200' },
    department: 'Finance',
    priority: TicketPriority.Medium,
    status: TicketStatus.InProgress,
    category: TicketCategory.Software,
    createdAt: '2023-10-27T12:00:00Z',
    lastUpdate: '2023-10-27T12:30:00Z',
    assignedTo: 'USR-007',
    conversations: []
  },
  {
    id: 'TICK-008',
    subject: 'Request for Projector for Board Meeting',
    description: 'We need a projector and a screen for the main board meeting room on Friday, Oct 27th, from 2 PM to 4 PM.',
    user: { id: 'USR-009', name: 'Chris Evans', avatar: 'https://picsum.photos/id/8/200/200' },
    department: 'Management',
    priority: TicketPriority.Low,
    status: TicketStatus.Closed,
    category: TicketCategory.Hardware,
    createdAt: '2023-10-24T09:00:00Z',
    lastUpdate: '2023-10-24T10:00:00Z',
    assignedTo: 'USR-003',
    conversations: []
  },
];


export const assets: Asset[] = [
    { id: 'ASSET-001', type: AssetType.Laptop, serialNumber: 'SN-LAP-12345', brand: 'Dell', model: 'XPS 15', status: AssetStatus.InUse, assignedUser: { id: 'USR-002', name: 'Jane Doe' }, purchaseDate: '2022-01-15', warrantyExpiry: '2025-01-14' },
    { id: 'ASSET-002', type: AssetType.Laptop, serialNumber: 'SN-LAP-12346', brand: 'Apple', model: 'MacBook Pro 14"', status: AssetStatus.InUse, assignedUser: { id: 'USR-003', name: 'John Smith' }, purchaseDate: '2022-03-20', warrantyExpiry: '2025-03-19' },
    { id: 'ASSET-003', type: AssetType.Printer, serialNumber: 'SN-PRN-67890', brand: 'HP', model: 'LaserJet Pro', status: AssetStatus.InStock, assignedUser: null, purchaseDate: '2021-11-05', warrantyExpiry: '2024-11-04' },
    { id: 'ASSET-004', type: AssetType.Monitor, serialNumber: 'SN-MON-54321', brand: 'LG', model: 'UltraWide 34"', status: AssetStatus.InRepair, assignedUser: null, purchaseDate: '2022-05-10', warrantyExpiry: '2025-05-09' },
    { id: 'ASSET-005', type: AssetType.Laptop, serialNumber: 'SN-LAP-12347', brand: 'Lenovo', model: 'ThinkPad X1', status: AssetStatus.Retired, assignedUser: null, purchaseDate: '2019-08-01', warrantyExpiry: '2022-07-31' },
    { id: 'ASSET-006', type: AssetType.Laptop, serialNumber: 'SN-LAP-12348', brand: 'Dell', model: 'Latitude 7420', status: AssetStatus.InUse, assignedUser: { id: 'USR-007', name: 'David Lee' }, purchaseDate: '2023-02-28', warrantyExpiry: '2026-02-27' },
];

export const knowledgeBaseArticles: KnowledgeBaseArticle[] = [
    {
        id: 'KB-001',
        title: 'How to troubleshoot common printer issues',
        content: '1. Check for paper jams in all access panels.\n2. Ensure the printer is connected to the network.\n3. Restart the printer and the computer you are printing from.\n4. Check toner and ink levels.\n5. If the issue persists, contact IT support with the printer model and error message.',
        category: TicketCategory.Hardware,
        author: { id: 'USR-001', name: 'Alexandre Monet' },
        createdAt: '2023-10-20T14:00:00Z',
        lastUpdate: '2023-10-22T09:00:00Z',
    },
    {
        id: 'KB-002',
        title: 'Connecting to Corporate Wi-Fi (CorpNet)',
        content: '1. Open your device\'s Wi-Fi settings.\n2. Select "CorpNet" from the list of available networks.\n3. Enter your corporate email and password when prompted.\n4. Accept the security certificate if prompted.\n5. You should now be connected. If you have issues, try "forgetting" the network and reconnecting.',
        category: TicketCategory.Network,
        author: { id: 'USR-001', name: 'Alexandre Monet' },
        createdAt: '2023-10-15T11:00:00Z',
        lastUpdate: '2023-10-15T11:00:00Z',
    },
    {
        id: 'KB-003',
        title: 'Resolving Outlook Syncing Problems',
        content: 'If Outlook is not syncing your latest emails on your mobile device:\n1. Ensure you have a stable internet connection.\n2. Pull down to manually refresh the inbox.\n3. Go to Settings within the Outlook app, select your account, and tap "Reset Account".\n4. If the issue continues, remove and re-add the email account.',
        category: TicketCategory.Software,
        author: { id: 'USR-003', name: 'John Smith' },
        createdAt: '2023-10-25T16:00:00Z',
        lastUpdate: '2023-10-25T16:00:00Z',
    },
];