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

## API Documentation

Base URL: `http://localhost:5000/api`

All responses are JSON. Success responses look like:
```json
{ "success": true, "data": { ... } }
```
Error responses look like:
```json
{ "success": false, "message": "...", "details": [ ... ] }
```
`details` is only present when it's a validation error.

---

### Create an order

`POST /orders`

Body:
```json
{
  "store_id": "store_1",
  "items": [
    { "item_id": "itm_1", "name": "Veg Burger", "qty": 2, "price": 150 }
  ],
  "total_amount": 300
}
```
`total_amount` is optional - if left out, it's calculated from `items` on the server.

Response `201`:
```json
{
  "success": true,
  "data": {
    "_id": "66f1a2...",
    "store_id": "store_1",
    "items": [{ "item_id": "itm_1", "name": "Veg Burger", "qty": 2, "price": 150 }],
    "total_amount": 300,
    "status": "PLACED",
    "created_at": "2026-09-06T10:00:00.000Z"
  }
}
```

Errors: `400` if `store_id` is missing or `items` is empty/invalid.

---

### List orders for a store

`GET /orders?store_id=store_1&page=1&limit=10&status=PLACED`

Query params:
| param | required | notes |
|---|---|---|
| store_id | yes | which store's orders to fetch |
| page | no | defaults to 1 |
| limit | no | defaults to 20, capped at 100 |
| status | no | PLACED / PREPARING / COMPLETED |

Response `200`:
```json
{
  "success": true,
  "data": [ { "_id": "...", "store_id": "store_1", "status": "PLACED", ... } ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

Errors: `400` if `store_id` is missing.

---

### Get a single order

`GET /orders/:id`

Response `200`: `{ "success": true, "data": { ...order } }`
Errors: `404` if the order doesn't exist.

---

### Update order status

`PATCH /orders/:id/status`

Body: `{ "status": "PREPARING" }`

Status can only move forward: `PLACED -> PREPARING -> COMPLETED`. Skipping a step or going backwards returns a `400`.

Response `200`: `{ "success": true, "data": { ...updated order } }`

---

### Cancel an order

`DELETE /orders/:id`

Only works if the order is still `PLACED`.

Response `200`: `{ "success": true, "message": "order cancelled" }`
Errors: `400` if the order has already moved past PLACED, `404` if it doesn't exist.

---

### Analytics - orders per day

`GET /analytics/orders-per-day?store_id=store_1&days=30`

`store_id` optional (omit for all stores), `days` optional (defaults to 30).

Response `200`:
```json
{
  "success": true,
  "data": [
    { "date": "2026-09-01", "orders": 12, "revenue": 3400 },
    { "date": "2026-09-02", "orders": 9, "revenue": 2100 }
  ]
}
```

---

### Analytics - revenue per store

`GET /analytics/revenue-per-store`

Only counts `COMPLETED` orders.

Response `200`:
```json
{
  "success": true,
  "data": [
    { "store_id": "store_1", "total_revenue": 54200, "order_count": 180 }
  ]
}
```

---

### Analytics - top selling items

`GET /analytics/top-items?store_id=store_1&limit=5`

`store_id` optional, `limit` optional (defaults to 5).

Response `200`:
```json
{
  "success": true,
  "data": [
    { "item_id": "itm_1", "name": "Veg Burger", "total_qty": 320, "total_revenue": 48000 }
  ]
}
```

---

### Archive old orders

`POST /archive-old-orders`

Moves orders older than 30 days into the `orders_archive` collection, in batches of 500.

Response `200`:
```json
{ "success": true, "message": "archived 1200 orders", "archived_count": 1200 }
```

---

## WebSocket events

Connect to `http://localhost:5000`.

Client emits:
- `subscribe:store` with a `store_id` - joins that store's room
- `unsubscribe:store` with a `store_id` - leaves it

Server emits (only to clients subscribed to that store):
- `order:created` - full order object
- `order:status_updated` - `{ id, store_id, status }`
- `order:cancelled` - `{ id, store_id }`

Reconnects are handled by socket.io's client automatically, the frontend re-subscribes to the current store on reconnect.

## A few notes

- total_amount gets calculated server side from the items, not taken from the request
- status only moves PLACED -> PREPARING -> COMPLETED
- revenue per store only counts completed orders
- stores are hardcoded on the frontend right now, would normally come from an api
- archive endpoint does it in batches of 500 instead of all at once
- didn't add auth or tests, ran out of time
