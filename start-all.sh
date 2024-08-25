#!/bin/bash 

# backend
echo "Démarrage du backend..."
cd backend
./mvnw spring-boot:run &

echo "Démarrage du frontend..."
cd ../frontend
npm run dev &

wait