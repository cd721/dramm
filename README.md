# DRAMM
Discover, Research, Map, and Meet

## About the App

It has been proven that spending time in nature is good for one’s health. DRAMM helps people find out about what nature-related activities are in their area. It provides outing recommendations based weather forecasts. Users can search for and keep track of places they've visited on their personal calendar.

## Getting Started

Follow these instructions to set up and run the backend, frontend, and Redis services for the project.

---

## Running the Project

### 1. **Start Backend Server**

Navigate to the backend folder:

```bash
cd backend
npm install
```

Seed the database
```bash
npm run seed
```

After the database has finished being seeded, you may start the backend 
```bash
npm start
```

### 2. **Start Frontend**

Open a terminal and run the following commands:

```bash
cd frontend
npm install
npm run dev
```

### 3. **Run Redis Stack Server**

Open a terminal and run the following command:

```bash
redis-stack-server
```

### 4. **Use the application**

Navigate to localhost:5173 in your browser.

You may log in with the user accounts listed below.

Email: testing1@gmail.com
Password: testing123

Email: testing2@gmail.com
Password: testing21

Email: testing3@gmail.com
Password: anothertest123

### 5. Information about Docker/Azure Deployment

Note: The branch "main" is for running the application locally. The branch "deployment" is used for containerizing and deploying the application.
