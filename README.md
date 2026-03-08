# ⚙️ KeraFlour Backend Engine

The central nervous system of the KeraFlour ecosystem. This Node.js/Express server powers both the **Admin Dashboard** and the **Mobile Client** with real-time data and secure business logic.

## 🌟 Core Services

### 📡 Real-time Synchronization

Uses **Socket.io** to push machine status updates (Free/Busy/Maintenance) to all connected clients within milliseconds.

### 🍱 RESTful API

Comprehensive endpoints for:

- **Authentication**: Secure JWT-based admin login.
- **Product Management**: CRUD operations for the internal product catalog.
- **Machine State**: Availability and status tracking.

### 🛡️ Security & Reliability

- **CORS Protection**: Configured for specific frontend and mobile origins.
- **Health Monitoring**: Integrated health check routes for UptimeRobot.
- **Database**: Professional Document Storage via MongoDB Atlas.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB (Mongoose ODM)
- **Media Handling**: Cloudinary SDK
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt

---

## 🚀 Deployment

The backend is professionally hosted on **Render**.

- **Auto-deployment**: Linked directly to the main GitHub branch.
- **Environment Management**: Securely stores Secrets (Cloudinary keys, DB URIs).

---

## ⚙️ Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   - `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`
3. Start the engine:
   ```bash
   npm start
   ```

---
