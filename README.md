
# RecruitFlow CRM

A recruitment Customer Relationship Management (CRM) system built with React, TypeScript, and modern web technologies.

## Features

- **Companies Management**
  - Three-column layout (list - info - vacancies)
  - Inline editing of company fields
  - Multiple contact methods per company

- **Vacancies & Candidates**
  - Kanban-style board with drag-and-drop
  - Columns for different stages of recruitment
  - Card details drawer
  
- **Candidate Database**
  - Infinite scroll table
  - Filtering and search
  - Link candidates to vacancies
  
- **Global Features**
  - Floating "Add" button for quick creation
  - Real-time notifications
  - Audit trail
  - Authentication system

## Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query (TanStack Query)
- **Animations**: Framer Motion
- **Drag and Drop**: @dnd-kit
- **Routing**: React Router v6
- **Forms**: React Hook Form

## Project Structure

```
src/
├── api/          # API mock endpoints and types
├── components/   # UI components
│   ├── ui/       # shadcn/ui components
│   ├── layout/   # Layout components
│   ├── common/   # Shared components
│   ├── companies/# Company-related components
│   ├── kanban/   # Kanban board components
│   └── candidates/# Candidate-related components
├── hooks/        # Custom React hooks
├── pages/        # Page components
└── utils/        # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Mock API

The project uses a mock API for demonstration purposes. The mock data is stored in memory and reset when the application reloads. The API endpoints are located in the `src/api` directory.

### Replacing with Real API

To replace the mock API with a real backend:

1. Keep the same API structure and function signatures
2. Replace the function implementations with actual API calls
3. Update the return types to match the expected data structure

Example:

```typescript
// Mock API (current)
export const getCompanies = async (): Promise<ApiResponse<PaginatedResponse<Company>>> => {
  // Mock implementation
  return {
    success: true,
    data: {
      data: mockCompanies,
      total: mockCompanies.length,
      page: 1,
      limit: 10,
    }
  };
};

// Real API (replace with)
export const getCompanies = async (): Promise<ApiResponse<PaginatedResponse<Company>>> => {
  // Real implementation
  const response = await fetch('https://api.example.com/companies');
  const data = await response.json();
  
  return {
    success: true,
    data: {
      data: data.companies,
      total: data.total,
      page: data.page,
      limit: data.limit,
    }
  };
};
```

## Authentication

The application includes a demo authentication system. Use the following credentials:

- Email: john@recruitflow.com
- Password: password

## License

This project is proprietary and confidential.
