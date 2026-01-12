# TaskFlow - Full-Stack Task Management Application

A modern, full-stack task management application built with **NestJS** (backend) and **Next.js** (frontend) with **PostgreSQL** database.

## 🚀 Features

### Backend (NestJS + Prisma + PostgreSQL)
- ✅ RESTful API for task management
- ✅ Complete CRUD operations
- ✅ Advanced filtering (status, priority, category)
- ✅ Category management
- ✅ Strong validation with class-validator
- ✅ CORS enabled for frontend communication

### Frontend (Next.js + React + TypeScript + Tailwind CSS)
- ✅ Modern responsive UI
- ✅ Task dashboard with real-time filters
- ✅ Create, edit, and delete tasks
- ✅ Category selection (multiple per task)
- ✅ Status management
- ✅ Category management interface

### Database Schema
- **User**: id, name, email, createdAt
- **Task**: id, title, description, dueDate, priority, status, userId, createdAt, updatedAt
- **Category**: id, name, createdAt
- **Relationships**: Tasks ↔ Categories (many-to-many)

## 🛠️ Tech Stack

- **Backend**: NestJS, Prisma ORM, PostgreSQL, TypeScript
- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **Validation**: class-validator, class-transformer
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
taskflow-fullstack/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── prisma/         # Database configuration
│   │   ├── task/           # Task module (CRUD)
│   │   ├── category/       # Category module (CRUD)
│   │   ├── user/           # User module (placeholder)
│   │   └── app.module.ts   # Main app module
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/                # Next.js React application
│   ├── src/
│   │   ├── app/            # Next.js app router pages
│   │   ├── lib/            # API client and utilities
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── .gitignore              # Comprehensive git ignore
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow-fullstack
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Database Configuration

1. **Update database connection in `backend/.env`**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

2. **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run start:dev
   ```
   Backend will run on: http://localhost:3000

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on: http://localhost:3001

## 📋 API Endpoints

### Tasks
- `GET /tasks` - List tasks with filters
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `PATCH /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete task

### Categories
- `GET /categories` - List all categories
- `POST /categories` - Create new category
- `GET /categories/:id` - Get category by ID
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## 🎨 Frontend Pages

- `/` - Dashboard (task list with filters)
- `/tasks/new` - Create new task
- `/tasks/[id]` - Task details
- `/tasks/[id]/edit` - Edit task
- `/categories` - Category management

## 🔧 Development

### Backend Scripts
```bash
npm run start:dev      # Development with hot reload
npm run build         # Build for production
npm run test          # Run tests
npm run lint          # Lint code
```

### Frontend Scripts
```bash
npm run dev           # Development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Lint code
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Start the server: `npm run start:prod`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `out/` directory to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.