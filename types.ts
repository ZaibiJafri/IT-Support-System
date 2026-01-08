
export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  SentToRepair = 'Sent to Repair',
  Closed = 'Closed',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum TicketCategory {
    Hardware = 'Hardware',
    Software = 'Software',
    Network = 'Network',
    AccountAccess = 'Account Access',
    Other = 'Other',
}

export interface Message {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  content: string;
  timestamp: string;
  isSystemMessage?: boolean;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  user: {
    id:string;
    name: string;
    avatar: string;
  };
  department: string;
  priority: TicketPriority;
  status: TicketStatus;
  category: TicketCategory;
  createdAt: string;
  lastUpdate: string;
  conversations: Message[];
  assignedTo?: string; // User ID
  triageSummary?: string;
  slaBreachRisk?: 'Low' | 'Medium' | 'High';
}

export enum UserRole {
    Employee = 'Employee',
    IT = 'IT Support',
    Admin = 'IT Admin',
    HR = 'HR',
}

export enum UserStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department: string;
  avatar: string;
  password?: string;
}

export enum AssetStatus {
    InUse = 'In Use',
    InStock = 'In Stock',
    InRepair = 'In Repair',
    Retired = 'Retired',
}

export enum AssetType {
    Laptop = 'Laptop',
    Printer = 'Printer',
    Monitor = 'Monitor',
    Charger = 'Charger',
    Other = 'Other',
}

export interface Asset {
    id: string;
    type: AssetType;
    serialNumber: string;
    brand: string;
    model: string;
    status: AssetStatus;
    assignedUser: {
        id: string;
        name: string;
    } | null;
    purchaseDate: string;
    warrantyExpiry: string;
}

export interface KnowledgeBaseArticle {
    id: string;
    title: string;
    content: string;
    category: TicketCategory;
    author: {
        id: string;
        name: string;
    };
    createdAt: string;
    lastUpdate: string;
}