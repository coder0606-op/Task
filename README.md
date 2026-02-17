
Real-Time Task Collaboration Platform

A lightweight Trello/Notion-style real-time task management platform built using the MERN stack. Users can create boards, lists, tasks, assign members, and see updates instantly.

---

Tech Stack

Frontend:
React (Vite)
Tailwind CSS
Context API for state management
Socket.IO client
DnD Kit for drag and drop

Backend:
Node.js
Express
MongoDB with Mongoose
JWT authentication
Socket.IO

---

Features

Core Features:
User authentication (signup/login)
Create boards
Create lists inside boards
Create, update, delete tasks
Assign users to tasks
Drag and drop tasks across lists
Real-time updates across users
Board member management
Protected routes

Real-Time:
Task creation sync
Task movement sync
List creation sync

---

Project Structure

root
server
controllers
models
routes
middleware
.env
server.js

frontend
src
api
components
context
pages
socket.js
package.json

---

Database Schema

User:
_id
name
email
password
createdAt

Board:
_id
title
owner (UserId)
members [UserId]
createdAt

List:
_id
title
boardId
order
createdAt

Task:
_id
title
description
boardId
listId
assignedTo [UserId]
order
createdAt

---

API Contract

Auth:
POST /api/auth/register
POST /api/auth/login

Boards:
GET /api/boards
POST /api/boards
POST /api/boards/add-member

Lists:
GET /api/lists/:boardId
POST /api/lists

Tasks:
GET /api/tasks/:boardId
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

---

Real-Time Sync Strategy

Technology:
Socket.IO with board-based rooms.

Flow:
User opens board:
socket.emit("join-board", boardId)

When task or list changes:
socket.emit("task-update")
socket.emit("list-update")

Server broadcasts:
task-updated
list-updated

All clients refresh data instantly.

---

Frontend Architecture

State Management:
Context API used for:
Auth state
User session

Local component state used for:
Boards
Lists
Tasks

Component Structure:
App
Layout
Navbar
Dashboard
Board
List
Task

---

Backend Architecture

Layered structure:
Routes → Controllers → Models → MongoDB

Responsibilities:
Routes define endpoints
Controllers contain business logic
Models define schemas
Middleware handles authentication

---

Scalability Considerations

Backend:
Use Redis adapter for Socket.IO
Horizontal scaling with load balancer
Split services:
Auth service
Task service
Notification service

Database indexes:
User.email (unique)
Board.members
Task.boardId
Task.listId
Task.title (text index)

---

Setup Instructions

1. Clone repository
   git clone <repo-url>
   cd project

---

Backend Setup

cd server
npm install

Create a .env file:

MONGO_URI=your_mongodb_connection
JWT_SECRET=supersecretkey

Run backend:
npm run dev

Backend runs on:http://localhost:5000

---

Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs on:http://localhost:5173

---

Demo Credentials

User 1:
email: test1@gmail.com
password : 12345678

You can also register and use 
---

Assumptions

Boards are accessible only to members.
No role-based permission system for simplicity.
Tasks have single-user assignment.

---

Trade-offs

No advanced permissions.
Activity log simplified.
Real-time handled via simple socket rooms without Redis.

---

Test Coverage

Backend tested using Postman.
Auth, board, list, and task flows verified.

---

Deployment Notes

Backend environment variables:
PORT
MONGO_URI
JWT_SECRET

Frontend API base URL:Configured inside src/api/axios.js

---
