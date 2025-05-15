
# Turquoise Travel Trove

Turquoise Travel Trove is a modern, full-stack travel planning application designed to help users personalize their travel experiences based on detailed preferences.

The platform leverages the robust **MERN stack (MongoDB, Express, React, Node.js)** with **TypeScript** for type safety and maintainability, and features a rich, accessible, and responsive user interface.

---


## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---
## 🌍 Overview

Turquoise Travel Trove enables users to create and manage detailed travel preference profiles, including:

- Dietary needs  
- Mobility requirements  
- Interests  
- Budget  
- Accommodation  
- Activity comfort  
- Transportation  
- Travel style  
- Special requirements  

The application provides personalized travel recommendations and streamlines the planning process for travelers with diverse needs.

---
## ✨ Features

- 🔐 **User Authentication** – Secure login and registration using JWT  
- ⚙️ **User Preferences** – Comprehensive multi-section preferences form  
- 🧭 **Multi-Step Wizard** – Guided onboarding for setting preferences  
- 🧠 **Global State Management** – Efficient state handling with Zustand  
- ✅ **Validation & Accessibility** – Zod + React Hook Form for validation; responsive, accessible UI  
- 🔁 **RESTful API** – Clean backend structure for managing data  
- 🧪 **Testing** – Frontend and backend test coverage for reliability

---
## 🧰 Tech Stack

### Backend
- **Node.js & Express** – RESTful API server
- **MongoDB & Mongoose** – Database & ODM
- **TypeScript** – Type safety
- **JWT** – Authentication
- **Vitest & mongodb-memory-server** – Testing

### Frontend
- **React (Vite)** – UI Framework
- **TypeScript** – Type safety
- **Zustand** – State management
- **React Hook Form + Zod** – Form handling & validation
- **Tailwind CSS** – Styling
- **Jest / React Testing Library** – Frontend testing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/turquoise-travel-trove.git
cd turquoise-travel-trove
```
2. **Install dependencies**

**Backend**
```bash
cd server
npm install
```

**Frontend**
```bash
cd client
npm install
```

3. ### Set up environment variables 
- Copy .env.example to .env in both the server and client directories.

- Fill in the required environment variables (e.g., database URI, JWT secret).

4. ### Run the application

**Frontend**
```bash
cd client
npm run dev
```

**Backend**
```bash
cd server
npm run dev
```

5. ### Access the app

```bash
Open your browser and go to:
🔗 http://localhost:5173
```


## 🧪 Testing

**Backend (from /server directory):**
```bash
npm run test
```

**Frontend (from /client directory):**
```bash
npm run test
```
## 🤝 Contributing

Contributions are welcome!
Please open issues and submit pull requests for new features, bug fixes, or improvements.

See CONTRIBUTING.md for guidelines (coming soon).
## 📄 License

This project is licensed under the MIT License.
## 🧳 Turquoise Travel Trove — Personalized travel, made easy.