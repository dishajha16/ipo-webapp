Overview:
Bluestock IPO Web App is a full-stack web application that provides IPO listings, investor insights, and brokerage services. It is built using Node.js, Express.js, MongoDB, and EJS templates. The project enables users to explore IPOs, manage investments, and authenticate securely.

Features: Secure login and signup using Passport.js, Fetch and display upcoming and active IPOs, Super Investor profiles and analytics, Supports various brokerage firms, Manage IPOs and user data, Designed with EJS templates and CSS.

Installation and Setup- Prerequisites: Node.js (>= 16.x recommended), MongoDB (Cloud or Local Instance)

Steps to Run the Project: Clone the repository: git clone <your-repo-url> 
cd <project-folder>

Install dependencies: npm install
Set up environment variables:
Create a .env file in the root directory.
Add necessary credentials like MongoDB URI, JWT secret, etc.

Start the server:
node server.js

Access the application:
Open http://localhost:5000/listings in your browser.

Technologies Used:
Backend: Node.js, Express.js, Passport.js
Frontend: EJS, CSS, JavaScript
Database: MongoDB (Mongoose ODM)
Authentication: JWT
APIs & Services: Public API integrations for IPO data
