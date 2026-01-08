
# Enterprise IT Support & Asset Management Portal

A modern, intelligent, and responsive web application designed to be the central nervous system for an enterprise's IT operations. This tool empowers IT administrators and support staff to manage tickets, track assets, and proactively address issues, while providing a seamless support experience for all employees.

The application is built with a focus on efficiency, leveraging AI to automate triage, provide contextual insights, and accelerate problem resolution.

---

## ✨ Key Features

### Core Modules
*   **Ticket Management:** A complete system for tracking IT support requests from creation to resolution. View conversations, update status/priority, and manage assignments.
*   **Asset Management:** Full lifecycle tracking of all company hardware. Monitor asset status (In Use, In Stock, In Repair), assigned users, purchase dates, and warranty expirations.
*   **User Management:** Centralized control over all user accounts, with distinct roles and permissions.
*   **Knowledge Base:** A fully-featured self-service portal where IT staff can create, read, and edit articles to resolve common issues, significantly reducing ticket volume.
*   **Reporting & Analytics:** A visual dashboard with interactive charts displaying key metrics like tickets by priority and category, enabling data-driven decision-making.

### 🤖 AI-Powered Intelligence (via Gemini API)
*   **AI-Powered Triage:** An integrated "Mailbox" feature automatically parses pasted emails, identifies the user, creates a ticket, and uses AI to assign a category, priority, a concise triage summary, and an **SLA Breach Risk** level.
*   **"User 360°" Context Panel:** When viewing a ticket, staff get an instant, at-a-glance panel showing the user's assigned assets, recent ticket history, and an AI-generated summary of recurring issues.
*   **In-Ticket AI Assistant:** Provides AI-generated troubleshooting steps and suggests relevant articles from the Knowledge Base based on the ticket's content, enabling faster resolutions.
*   **Proactive Dashboard Insights:** The admin dashboard features an AI panel that analyzes recent ticket data to identify emerging trends and suggest proactive actions (e.g., "Multiple printer failures in Finance Dept may indicate a driver issue.").
*   **Smart Search:** Users can use natural language queries (e.g., "show me open hardware tickets for Jane") to intelligently filter through all tickets and assets.

### 👨‍💻 User Experience & Design
*   **Role-Based Dashboards:** The application provides a tailored experience for each role.
    *   **IT Admin:** A high-level strategic dashboard with global KPIs and AI insights.
    *   **IT Support:** A personalized "My Workload" dashboard focused on assigned tickets and personal performance metrics.
    *   **Employee:** A clean, simple portal to create and view the status of their own tickets.
*   **Fully Responsive:** A mobile-first design ensures a seamless experience on any device. Data tables gracefully transform into user-friendly cards on smaller screens, eliminating horizontal scrolling.
*   **Non-Volatile Storage:** All data is automatically saved to the browser's `localStorage`, ensuring no work is lost between sessions.
*   **Data Management:** Admins can export all application data (tickets, assets, users, KB) to a JSON file for backup and reset the application to its initial demo state.

---

## 🛠️ Technology Stack

*   **Frontend:** React.js, TypeScript
*   **Styling:** TailwindCSS
*   **AI Integration:** Google Gemini API for all intelligent features.
*   **Charting:** Recharts
*   **State Management:** React Context API
*   **Persistence:** Browser `localStorage` via a custom `useLocalStorage` hook.

---

## 🚀 Getting Started

This is a browser-based application with no installation required.

### Login Credentials

You can log in with one of the pre-configured demo accounts to experience the different roles:

1.  **IT Admin** (Full Access)
    *   **Email:** `admin@example.com`
    *   **Password:** `password`

2.  **IT Support Staff** (Access to "My Workload" dashboard and ticket management)
    *   **Email:** `support@example.com`
    *   **Password:** `password`

3.  **Standard Employee** (Access to the employee-facing ticket submission portal)
    *   **Email:** `employee@example.com`
    *   **Password:** `password`

