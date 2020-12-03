#!/bin/bash

echo "This script is for quickly running both the frontend and backend Docker-Compose commands for development purposes"
echo "To run the frontend or backend separately, cd frontend && npm run dev:docker:start or cd backend && npm run dev:docker:start"

cd backend && npm run dev:docker:start 
cd ../frontend && npm run dev:docker:start 