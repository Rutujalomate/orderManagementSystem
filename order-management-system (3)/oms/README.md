# Order Management System

Node/Express + MongoDB backend, Next.js frontend, sockets for live updates.

## Running it

with docker:
```
docker-compose up --build
```
frontend at localhost:3000, backend at localhost:5000/api

or manually, need mongo running locally.

backend:
```
cd backend
cp .env.example .env
npm install
npm run dev
```

frontend:
```
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Backend on 5000, frontend on 3000.

## Endpoints

POST /api/orders
GET /api/orders?store_id=&page=&limit=&status=
GET /api/orders/:id
PATCH /api/orders/:id/status
DELETE /api/orders/:id (cancel, only if still PLACED)

GET /api/analytics/orders-per-day
GET /api/analytics/revenue-per-store
GET /api/analytics/top-items

POST /api/archive-old-orders

## A few notes

- total_amount gets calculated server side from the items, not taken from the request
- status only moves PLACED -> PREPARING -> COMPLETED
- revenue per store only counts completed orders
- stores are hardcoded on the frontend right now, would normally come from an api
- archive endpoint does it in batches of 500 instead of all at once
- didn't add auth or tests, ran out of time
