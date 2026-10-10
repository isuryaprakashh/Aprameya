# Aprameya -

**Aprameya** is a full-stack web application designed for the "Innovation Lab" community. It serves as a central hub for managing events, showcasing projects, publishing research,/blogs and managing user profiles with role-based access control.

## 🚀 Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, TanStack Query.
*   **Backend**: Node.js, Express.js, TypeScript.
*   **Database**: MongoDB (via Mongoose).
*   **Authentication**: Session-based auth (`express-session`), compatible with production environments (Render/Vercel).
*   **Architecture**: Monorepo (`/client` and `/server`).

---

## 📂 Project Structure

```
Aprameya/
├── client/                 # React Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Shadcn, Custom)
│   │   ├── pages/          # Route pages (Home, Events, Profile, etc.)
│   │   ├── lib/            # Utilities, API client (queryClient), Types
│   │   └── context/        # React Context (AuthContext)
│   └── ...
├── server/                 # Express Backend application
│   ├── routes/             # API Endpoints (auth, users, events, etc.)
│   ├── models/             # Mongoose Models (if separate) or storage logic
│   ├── middleware/         # Auth & Security middleware
│   └── ...
└── ...
```

---

## 🔑 Key Features & Workflows

### 1. Authentication & Roles
The platform uses a role-based permission system:
*   **Aspirant (Default)**: Can view content, register for events, and manage their own profile.
*   **Core Team**: Can view all content and has edit privileges for Projects, Blogs, and Research.
*   **Admin**: Full system access, including User Management and deleting content.

**Workflow**:
1.  User signs up -> Assigned `ASPIRANT` role.
2.  Login -> Session created (secure HTTP-only cookie).
3.  Admin can upgrade users to `CORE` or `ADMIN` via the Dashboard.

### 2. Events Module
*   **Public View**: Users can browse upcoming events, filter by type, and search.
*   **Registration**: Logged-in users can click "Register Now".
    *   *Backend Check*: Prevents duplicate registrations.
    *   *Frontend*: Updates UI to "Registered" and provides a "Cancel" option in the profile.
*   **Admin**: Can create new events and view a list of all registrations.

### 3. Content Modules (Projects, Blogs, Research)
These modules share a similar "Collaborative" workflow:
*   **View**: Publicly accessible.
*   **Create/Edit**: Restricted to `CORE` team and `ADMIN` users.
    *   *Aspirants* do not see the "New Project" or "Edit" buttons.
    *   *Backend*: API routes (`POST`, `PUT`, `DELETE`) are protected by `isAdminOrCore` middleware.

### 4. User Profile & Dashboard
*   **Personal Dashboard**: Shows the user's registered events and profile details.
*   **Admin Dashboard**:
    *   **Stats**: Overview of total users, projects, and registrations.
    *   **User Management**: Table view to promote/demote user roles or deactivate accounts.
*   **Security**: Passwords are never sent in API responses.

---

## 🛠️ Setup & Installation

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)

### 1. Environment Variables
Environment variables are configured in `server/.env` and `client/.env`:

**server/.env**:
```env
PORT=5001
MONGODB_URI="mongodb+srv://..."
SESSION_SECRET="your-secret-key"
NODE_ENV="development"
CLIENT_ORIGIN="http://localhost:5173"
```

**client/.env**:
```env
VITE_API_URL=http://localhost:5001
```

### 2. Running Locally 

From the root workspace directory (`website/`):
```bash
# Start both Backend (port 5001) and Frontend (port 5173) concurrently:
npm run dev
```

Or run individually:
```bash
# Terminal 1 (Server):
npm run dev:server

# Terminal 2 (Client):
npm run dev:client
```

Access the frontend at `http://localhost:5173` and backend API at `http://localhost:5001`.

---

## 🛡️ Security Notes
*   **Global Error Boundary**: The frontend is wrapped in an Error Boundary to prevent crashes.
*   **Rate Limiting**: API is protected against spam.
*   **Secure Headers**: `Helmet` is active on the backend. 
