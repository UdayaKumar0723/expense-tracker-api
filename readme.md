# 🚀 Expense Tracker API

A **production-ready backend API** built using Node.js, TypeScript, and MongoDB.
This project demonstrates clean architecture, authentication, validation, and real-world backend practices.

---

## 🔥 Features

- 🔐 User Authentication (JWT)
- 💰 Expense Management (Create, Read, Update, Delete)
- 📊 Budget Management (Monthly budgets)
- 📈 Expense Analytics (Insights & reports)
- 📄 Pagination & Filtering
- 📚 Swagger API Documentation
- ⚙️ Centralized Error Handling
- 🧾 Logging with Winston
- 🔒 Security Middleware (Helmet, Rate Limiting)
- ✅ Input Validation (Zod / DTOs)

---

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT (Authentication)
- Zod (Validation)
- Swagger (API Docs)
- Winston (Logging)

---

## 📂 Project Structure

```
src/
 ├── config/         # DB & env config
 ├── middlewares/    # Auth, error, validation
 ├── modules/        # Feature modules
 │    ├── auth/
 │    ├── expense/
 │    └── budget/
 ├── utils/          # Logger, response, errors
 ├── docs/           # Swagger JSON files
 ├── app.ts          # Express app config
 └── server.ts       # Entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in root:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## ▶️ Run Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 🌐 API Base URL

```
http://localhost:3000/api
```

---

## 📚 API Documentation

Swagger UI available at:

```
http://localhost:3000/api-docs
```

---

## 🔐 Authentication APIs

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

## 💰 Expense APIs

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| POST   | /api/expenses           | Create expense    |
| GET    | /api/expenses           | Get all expenses  |
| PATCH  | /api/expenses/:id       | Update expense    |
| DELETE | /api/expenses/:id       | Delete expense    |
| GET    | /api/expenses/analytics | Monthly analytics |

---

## 📊 Budget APIs

| Method | Endpoint    | Description        |
| ------ | ----------- | ------------------ |
| POST   | /api/budget | Set monthly budget |
| GET    | /api/budget | Get monthly budget |

---

## 📈 Example Analytics Response

```json
{
  "success": true,
  "message": "Analytics fetched successfully",
  "data": {
    "totalSpent": 8500,
    "categoryBreakdown": [
      { "category": "food", "total": 3000 },
      { "category": "travel", "total": 2000 }
    ],
    "topCategory": "food",
    "averageExpense": 850
  }
}
```

---

## 🧠 Key Backend Concepts Used

- Clean Architecture (Controller → Service → Repository)
- JWT Authentication & Middleware
- MongoDB Aggregation (Analytics)
- Global Error Handling
- Request Validation (DTO / Zod)
- Rate Limiting & Security Headers
- Logging for Production Debugging

---

## 🚀 Future Improvements

- 🔹 Redis caching (performance boost)
- 🔹 Background jobs (queues)
- 🔹 Role-based access control (RBAC)
- 🔹 Export reports (CSV/PDF)
- 🔹 Docker support

---

## 👨‍💻 Author

**Udaya Kumar**

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it!
