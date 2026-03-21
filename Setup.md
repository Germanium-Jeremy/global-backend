# Backend Setup and Testing Guide

This guide provides instructions for setting up the backend services and testing the real-time WebSocket functionality.

## 🚀 Running the WebSocket Service

The `websocket-service` is a stateful service that manages real-time client connections.

### Installation and Launch
1. Navigate to the service directory:
   ```bash
   cd services/websocket-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the service in development mode:
   ```bash
   npm run dev
   ```

### Prerequisites
- **Redis**: Ensure a Redis server is running on `localhost:6379`. The service uses Redis Pub/Sub for inter-service communication.
- **Auth Service**: The `auth-service` must be running (or the `JWT_SECRET` must be shared/configured) to verify client tokens.

---

## 🛠 Testing with Postman (VS Code Extension)

We provide a pre-configured collection at `test-requests/postman_collection.json` to avoid manual setup.

### 1. Import the Collection
- Open the Postman extension in VS Code.
- Click **Import** $\rightarrow$ select `test-requests/postman_collection.json`.

### 2. Authenticating via HTTP
Before connecting to WebSockets, you need a valid token:
- Run the **"Login Standard User"** or **"Login Admin"** request.
- The collection automatically saves the returned token into a variable called `{{token}}` or `{{adminToken}}`.

### 3. Connecting to WebSockets (Socket.io)
Because we use **Socket.io**, a standard WebSocket request will not work. Follow these steps:
1. Open the **"Connect to WebSocket"** request.
2. Change the request type to **Socket.io**.
3. In the **Auth/Handshake** settings, add an `auth` object:
   - Key: `token`
   - Value: `{{token}}`
4. Click **Connect**.

---

## 📡 Testing Real-time Pushes (Server $\rightarrow$ Client)

Since the WebSocket service is designed to push messages triggered by other services, you can simulate this using the Redis CLI.

### Simulating a Push Notification
While your Postman client is connected, run the following command in your terminal:

```bash
redis-cli PUBLISH ws:outbound '{"userId": "your_user_id", "type": "NOTIFICATION", "payload": {"message": "Hello from the backend!"}, "timestamp": "2026-07-18T12:00:00Z"}'
```

**Note**: Replace `your_user_id` with the actual MongoDB `_id` of the user associated with the token you used to connect.

### Expected Result
The connected client in Postman should immediately receive a message with the `NOTIFICATION` type and the provided payload.

---

## 📂 Project Architecture Summary
- **API Gateway**: `http://localhost:3000` (Proxies `/ws` to port 3005).
- **WebSocket Service**: `http://localhost:3005`.
- **Redis Channel**: `ws:outbound` (Used by all services to send messages to clients).
