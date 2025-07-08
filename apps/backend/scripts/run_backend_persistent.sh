#!/bin/bash
# Script to run backend server persistently

while true; do
  cd apps/backend
  pnpm run dev
  echo "Backend server stopped. Restarting in 5 seconds..."
  sleep 5
done
