# Global Backend Microservices

This project is a comprehensive microservice-based backend designed to serve multiple frontend applications. It provides core functionalities including authentication, AI-powered chat, file management, and real-time communication via WebSockets.

## 🏗️ System Architecture

The backend follows a microservices architecture, using an **API Gateway** as the single entry point for all clients. The Gateway handles request routing and proxies requests to the appropriate downstream services.

### Routing Table

| Gateway Path | Backend Service | Internal Port | Responsibility |
| :--- | :--- | :--- | :--- |
| `/auth` | `auth-service` | `3001` | User registration, login, and session management. |
| `/test` | `testing-service` | `3002` | Internal testing endpoints for access control validation. |
| `/files` | `files-service` | `3003` | CRUD operations for user-managed files/code snippets. |
| `/ai` | `ai-service` | `3004` | AI chat capabilities and custom system instructions. |
| `/ws` | `websocket-service` | `3005` | Real-time event communication using Socket.io and Redis. |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (or pnpm/yarn)
- **Docker** & **Docker Compose** (for easy deployment)
- **MongoDB** (via Docker or local installation)
- **Redis** (via Docker or local installation)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd global-backend
   ```

2. Install dependencies for all workspaces:
   ```bash
   npm install
   ```

### Environment Configuration

Each service requires its own environment variables. Create a `.env` file in the root or within each service directory. Key variables typically include:
- `PORT`: The port the service runs on.
- `MONGODB_URI`: Connection string for MongoDB.
- `JWT_SECRET`: Secret key used for signing and verifying JWTs.
- `REDIS_URL`: Connection string for Redis (used by `websocket-service`).
- `AI_API_KEY`: API key for the AI provider (used by `ai-service`).

---

## 🛠️ Running the Project

### Using Docker (Recommended)
The fastest way to start the entire system including MongoDB and Redis:
```bash
npm start
```
This command runs `docker-compose up --build`, launching the API Gateway and all backend services.

### Development Mode
To run the entire project in development mode with hot-reloading:
```bash
npm run dev
```

### Starting Individual Services
If you only need to work on a specific service, you can use the dedicated scripts:
- **API Gateway**: `npm run dev:gateway`
- **Auth Service**: `npm run dev:auth`
- **Files Service**: `npm run dev:files`
- **Testing Service**: `npm run dev:test`
- **AI Service**: `npm run dev:ai` (if available)

---

## 📖 API Documentation

### OpenAPI Specification
A detailed API specification is available in the **OpenAPI 3.0** format. You can use this file with any Swagger UI viewer.

- **Specification File**: [docs/openapi.yaml](./docs/openapi.yaml)

### Authentication
Most endpoints require a valid **JWT (JSON Web Token)**. 
- **Header**: `Authorization: Bearer <your_token>`
- Tokens are obtained via the `/auth/login` endpoint.

---

## 📁 Project Structure

The project is organized as a **monorepo** using npm workspaces:

- `api-gateway/`: The entry point that proxies requests to services.
- `services/`: Contains the individual microservices.
  - `auth-service/`: User identity and access management.
  - `ai-service/`: LLM integrations and chat history.
  - `files-service/`: User-specific file storage and metadata.
  - `websocket-service/`: Real-time communication layer.
  - `testing-service/`: Endpoint for verifying role-based access control (RBAC).
- `shared/`: Common types, utilities, and constants used across all services.
- `docs/`: API specifications and other documentation.
- `test-requests/`: Sample requests for testing endpoints.
