** Overview**
The **Finance Tracker API** is a RESTful API that helps users track their **income, expenses, budgets, financial reports, savings goals, and notifications**. It ensures **secure authentication, role-based access, and real-time financial tracking**.

---

** Technologies Used**
- **Node.js** - Runtime Environment  
- **Express.js** - Backend Framework  
- **MongoDB** - Database  
- **Mongoose** - ODM for MongoDB  
- **JWT (JSON Web Tokens)** - Authentication  
- **Nodemailer** - Email Notifications (Future Work)  
- **Jest & Supertest** - Unit & Integration Testing  
- **Postman** - API Testing  

---

 * Setup Instructions**
 # ** Clone the Repository**
# shell
git clone https://github.com/Shermon69/Finance-Tracker.git

Install Dependencies

cd project-finance-tracker
npm install

# Setup Environment Variables
Create a .env file in the root directory and add:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
BASE_CURRENCY=USD
# Start the Server
# shell
Copy
Edit
npm start
The server runs at: http://localhost:5000

 Key Features
* User Authentication (JWT-based)
* Role-Based Access (Admin & User)
* Expense & Income Tracking
* Budget Management & Alerts
* Financial Reports & Insights
* Recurring Transactions Handling
* Multi-Currency Support with Real-Time Exchange Rates
* Savings & Goal Tracking
* Notifications for Budget Alerts & Goal Achievements

 # API Reference
 # Authentication
# User Registration
Endpoint: POST /api/auth/register
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Response:

{
  "message": "User registered successfully"
}
User Login
Endpoint: POST /api/auth/login
Request Body:

{
  "email": "john@example.com",
  "password": "password123"
}
Response:

{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
# Transactions
 # Add a Transaction
Endpoint: POST /api/transactions
Headers:
{
  "Authorization": "Bearer jwt_token_here"
}
Request Body:

{
  "type": "expense",
  "catagory": "Food",
  "amount": 50,
  "note": "Dinner at a restaurant",
  "tags": ["dinner"]
}
Response:

{
  "message": "Transaction created successfully",
  "transaction": { ... }
}
# Retrieve Transactions
Endpoint: GET /api/transactions
Response:

[
  {
    "id": "transaction_id",
    "type": "expense",
    "catagory": "Food",
    "amount": 50,
    "date": "2025-03-06T09:21:10.079Z"
  }
]
# Budget Management
Create a Budget
Endpoint: POST /api/budgets
Request Body:

{
  "catagory": "Food",
  "amount": 500
}
Response:

{
  "message": "Budget set successfully"
}
# Financial Reports
Get Financial Report
Endpoint: GET /api/reports
Response:
{
  "totalIncome": 5000,
  "totalExpenses": 2000,
  "netSavings": 3000
}
# Notifications
Retrieve Notifications
Endpoint: GET /api/notifications
Response:

[
  {
    "message": "Budget exceeded for Food",
    "date": "2025-03-06T09:21:10.079Z",
    "read": false
  }
]
# Goals & Savings
Set a Savings Goal
Endpoint: POST /api/users/goals
Request Body:

{
  "name": "Buy a Laptop",
  "targetAmount": 2000,
  "deadline": "2025-06-01"
}
Response:

{
  "message": "Goal created successfully"
}
# Update Goal Progress
Endpoint: PUT /api/users/goals/:goalId
Request Body:

{
  "amount": 1000
}
Response:

{
  "savedAmount": 1000
}
# Testing
Run Tests
To run unit & integration tests:


npm test
✅ Jest test cases are implemented for authentication, transactions, budget, and goals.
