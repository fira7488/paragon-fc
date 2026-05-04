#!/bin/bash
echo "Starting Paragon FC Backend..."
cd backend
npm run dev &
echo "Backend starting on http://localhost:5000"
echo ""
echo "To view the website, open frontend/index.html in your browser"
echo "Admin dashboard: frontend/admin.html"
echo ""
echo "Admin Login: admin / admin123"
wait
