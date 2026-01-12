@echo off
echo Starting backend on port 3000 and frontend on port 3001...
start cmd /k "cd backend && npm run start:dev"
start cmd /k "cd frontend && npm run dev -p 3001"