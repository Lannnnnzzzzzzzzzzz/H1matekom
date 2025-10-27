[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![EJS](https://img.shields.io/badge/EJS-lightgrey?style=for-the-badge&logo=ejs&logoColor=white)](https://ejs.co/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> HIMATEKOM Financial Inventory System

This repository hosts `H1matekom`, a web-based financial inventory system built using Node.js, Express, EJS, and Mongoose. It provides robust functionalities for managing users, inventory, financial transactions, and announcements, featuring distinct interfaces for administrators and regular users.

## ✨ Key Features

*   **Comprehensive User Management:** Handles user creation, authentication, and management with distinct roles (admin/user) and session-based access control.
*   **Inventory Tracking System:** Enables administrators to manage and monitor inventory items through a dedicated dashboard.
*   **Financial Transaction Recording:** Facilitates the recording and oversight of financial transactions, accessible via an admin finance dashboard.
*   **Announcement Management:** Allows administrators to create, publish, and manage announcements within the system.
*   **Dedicated Admin Dashboards:** Provides a suite of administrative views for managing users, inventory, finances, and announcements.
*   **Secure Authentication & Authorization:** Implements session management and includes login testing utilities (`test-login.js`) to ensure secure user access.
*   **Data Seeding Capabilities:** Includes a `seed.js` script for populating the database with initial data, useful for development and testing.
*   **Robust Input Validation & Rate Limiting:** Integrates `express-validator` and `express-rate-limit` to enhance security by validating user input and preventing abuse.
*   **Vercel Deployment Ready:** Configured with `vercel.json` for seamless deployment to Vercel, simplifying hosting and scaling.

## 🛠️ Technology Stack

| Category            | Technology           | Notes                                                    |
| :------------------ | :------------------- | :------------------------------------------------------- |
| **Backend Framework** | Express.js           | Fast, unopinionated, minimalist web framework for Node.js. |
| **Templating Engine** | EJS                  | Embedded JavaScript templates for dynamic HTML rendering. |
| **Database (ODM)**  | Mongoose             | MongoDB object data modeling for Node.js.               |
| **Package Manager** | NPM                  | Used for managing project dependencies.                   |
| **Deployment**      | Vercel               | Serverless deployment platform.                          |
| **Authentication**  | `express-session`    | Middleware for managing user sessions.                   |
| **Input Validation**| `express-validator`  | Middleware for validating request data.                   |
| **Security**        | `express-rate-limit` | Basic rate limiting middleware to protect routes.         |
| **Environment Config**| `dotenv`             | Loads environment variables from a `.env` file.           |
| **Utilities**       | `body-parser`, `node-fetch` | For parsing request bodies and making HTTP requests.   |

## 🏛️ Architecture Overview

The `H1matekom` project follows a monolithic architecture built around the Node.js Express framework, adopting an MVC (Model-View-Controller) like pattern.

*   **Models:** Defined using Mongoose, residing in the `/models` directory, they interact directly with the MongoDB database (e.g., `User`, `Inventory`, `Transaction`, `Announcement`).
*   **Views:** EJS templates located in the `/views` directory are responsible for rendering the dynamic user interfaces. These are separated into `admin` and `user` specific dashboards and a common `login` page.
*   **Controllers/Routes:** Handled by `server.js`, which defines API endpoints and routes to serve the appropriate EJS views based on user authentication and roles.
*   **Static Assets:** Public-facing assets like CSS and client-side JavaScript are served from the `/public` directory.

The application serves as a backend service that dynamically renders full-stack web pages, providing distinct administrative and user-facing experiences within a single application.

## 🚀 Getting Started

Follow these steps to get a development environment up and running on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   MongoDB instance (local or cloud-based)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Lannnnnzzzzzzzzzzz/H1matekom.git
    cd H1matekom
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add your MongoDB connection URI and a session secret:

    ```
    MONGO_URI=your_mongodb_connection_string
    SESSION_SECRET=your_secret_session_key
    PORT=5000
    ```
    *(Note: The `vercel.json` implies `MONGO_URI` and `SESSION_SECRET` are Vercel secrets in production, but locally you'll need them in `.env`)*

### Running the Application

1.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The application should now be running on `http://localhost:5000` (or your specified PORT).

## 📂 File Structure

```
/
├── LOGIN_GUIDE.md
├── cookies.txt
├── models
│   ├── Announcement.js
│   ├── Inventory.js
│   ├── Transaction.js
│   └── User.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   └── style.css
│   └── js
│       └── theme.js
├── replit.md
├── seed.js
├── server.js
├── test-login.js
├── vercel.json
└── views
    ├── admin
    │   ├── announcements.ejs
    │   ├── dashboard.ejs
    │   ├── finance.ejs
    │   ├── inventory.ejs
    │   └── users.ejs
    ├── login.ejs
    ├── partials
    │   └── sidebar.ejs
    └── user
        └── dashboard.ejs

```

*   **/models**: Contains Mongoose schemas defining the data structure for entities like users, inventory, and transactions.
*   **/public**: Stores static assets such as CSS stylesheets and client-side JavaScript files.
*   **/views**: Houses all EJS templates, organized into subdirectories for `admin` and `user` specific dashboards, `login` pages, and `partials`.
*   **`server.js`**: The main entry point of the Express application, responsible for setting up routes, middleware, and starting the server.
*   **`seed.js`**: A utility script used to populate the database with initial data for development or testing purposes.
*   **`vercel.json`**: Configuration file for deploying the application to Vercel.
