# TLE Hackathon Student Performance Dashboard

A full-stack web application for managing and visualizing Codeforces student performance, including contest history, problem-solving stats, and reminders.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Frontend Usage](#frontend-usage)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Add, edit, and delete student profiles
- View detailed contest history and problem-solving analytics
- Download student data as CSV
- Dark/light mode toggle with persistent theme
- Remind students via email (opt-in/out)
- Responsive and modern UI

---

## Tech Stack

- **Frontend:** React, Axios, React Icons, CSVLink
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Other:** Context API for theme, custom analytics utilities

---

## Project Structure

```
tle_hackathon/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── my-app/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## Setup & Installation

### Backend

1. `cd backend`
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up your MongoDB connection in `server.js` or via environment variables.
4. Start the backend server:
    ```bash
    npm start
    ```
   The backend runs on `http://localhost:5000` by default.

### Frontend

1. `cd my-app`
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React app:
    ```bash
    npm start
    ```
   The frontend runs on `http://localhost:3000` by default.

---

## API Endpoints

### Students

- `GET    /api/students` — Get all students
- `POST   /api/students` — Add a new student
- `PUT    /api/students/:id` — Update a student
- `DELETE /api/students/:id` — Delete a student
- `GET    /api/students/:id` — Get a single student

### Analytics

- `GET /api/students/:id/contest-data?range=30` — Get contest data for a student (range in days)
- `GET /api/students/:id/problem-stats?range=30` — Get problem-solving stats for a student (range in days)

### CSV

- `GET /api/students/csv/download` — Download all students as CSV

---

## Frontend Usage

- **Add Student:** Click "➕ Add Student" and fill out the form.
- **Edit Student:** Click the ✏️ icon next to a student.
- **Delete Student:** Click the 🗑 icon.
- **View Profile:** Click the 👁 icon to open the Profile Drawer with analytics.
- **Download CSV:** Click "📥 Download CSV".
- **Toggle Theme:** Use the dark/light toggle in the navbar.

---

## Customization

- **Theme:** Uses Context API for persistent dark/light mode.
- **Analytics:** Analytics logic is in `backend/utils/analytics.js` and can be extended.
- **Reminders:** Email reminder logic can be turned of/on using button.
- **Codeforces Data Syn:**  whenever student is added cf data will be fetched of that particular student to mongodb with an api of cf and every day at 2:00 AM will be cf syncing function executed to update that cf data using CRON job.
- **Responsiveness:** our web application is responsive for tablet view (768 x 1024) and more
- **Graph:** added different types of graph for better view such as barchart, heatmap, rating chart

---

.env file 

PORT=5000
- MONGO_URI=
-  MAIL_USER=
-  MAIL_PASS=
-  CRON_TIME=0 2 * * *

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---



---

**Crafted with 💻 by Vikash Sinha**
