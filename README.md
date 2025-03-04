Overview:
Bluestock IPO Web App is a full-stack web application that provides IPO listings, investor insights, and brokerage services. It is built using Node.js, Express.js, MongoDB, and EJS templates. The project enables users to explore IPOs, manage investments, and authenticate securely.

Features:
User Authentication: Secure login and signup using Passport.js.
IPO Listings: Fetch and display upcoming and active IPOs.
Investor Insights: Super Investor profiles and analytics.
Brokerage Integration: Supports various brokerage firms.
Admin Dashboard: Manage IPOs and user data.
Responsive UI: Designed with EJS templates and CSS.

Project Structure:

C:.
│   .env
│   package-lock.json
│   package.json
│   server.js
│   trash
│
├───config
│       database.js
│       passport.js
│
├───helpers
│       dateHelpers.js
│       statusHelpers.js
│       wrapAsync.js
│
├───middlewares
│       ensureAuthenticated.js
│
├───models
│       Api.js
│       IPO.js
│       otp.js
│       User.js
│
├───public
│   ├───css (Contains all stylesheets)
│   ├───js (Frontend JavaScript files)
│   ├───images (Logos, investor images, and assets)
│
├───routes
│       admin.js
│       api.js
│       apiHandler.js
│       auth.js
│       authRoutes.js
│       management.js
│       public.js
│
├───templates
│       example.ejs
│       layout.ejs
│
├───utils
│       emailService.js
│       wrapAsync.js
│
└───views
    ├───includes (Reusable UI components)
    ├───layouts (Base layouts)
    ├───listings (EJS pages for different features)
    ├───partials (Sidebar, header, etc.)

Installation and Setup:

Prerequisites:
Node.js (>= 16.x recommended)
MongoDB (Cloud or Local Instance)

Steps to Run the Project:
Clone the repository: git clone <your-repo-url> 
cd <project-folder>

Install dependencies:
npm install

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