# UPSC Backend API

A comprehensive backend API for UPSC preparation platform built with Node.js, Express, and MongoDB. This platform provides article management, MCQ generation using Google Gemini AI, user authentication, bookmarking, and quiz attempt tracking.

## 🚀 Features

- **User Authentication** - Register, login with JWT tokens
- **Article Management** - CRUD operations for UPSC articles
- **AI-Powered MCQ Generation** - Generate MCQs using Google Gemini AI
- **Bookmarking System** - Save favorite articles
- **Quiz Attempts** - Track user quiz performances
- **Search Functionality** - Search articles by title/keywords

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **AI Integration**: Google Gemini AI
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Environment**: dotenv

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd UPSC-BACKED

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

## 🌐 Environment Variables

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/upsc_prep
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

---

## 🔐 Authentication APIs

### 1. Register User
- **POST** `/api/auth/register`
- **Description**: Create a new user account
- **Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "referralCode": "ABC12345" // optional
}
```
- **Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "subscriptionStatus": "trial",
    "referralCode": "generated_code",
    "streak": 0,
    "points": 0
  }
}
```

### 2. Login User
- **POST** `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Body**:
```json
{
  "emailOrUsername": "john@example.com",
  "password": "securepassword"
}
```
- **Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "subscriptionStatus": "trial",
    "referralCode": "ABC12345",
    "streak": 0,
    "points": 0
  }
}
```

---

## 👤 User APIs

### 3. Get User Profile
- **GET** `/api/users/me`
- **Description**: Get current user's profile information
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**:
```json
{
  "message": "Welcome to your profile",
  "user": {
    "id": "user_id",
    "username": "john_doe"
  }
}
```

---

## 📄 Article APIs

### 4. Create Article
- **POST** `/api/articles`
- **Description**: Create a new UPSC article (requires authentication)
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
```json
{
  "title": "VIKSIT BHARAT 2047",
  "source": "https://example.com/article",
  "bulletPoints": ["Point 1", "Point 2", "Point 3"],
  "aiAnswer": "Detailed AI-generated answer content"
}
```
- **Response**:
```json
{
  "message": "Article created",
  "article": {
    "_id": "article_id",
    "title": "VIKSIT BHARAT 2047",
    "source": "https://example.com/article",
    "bulletPoints": ["Point 1", "Point 2", "Point 3"],
    "aiAnswer": "Detailed AI-generated answer content",
    "date": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Get All Articles
- **GET** `/api/articles`
- **Description**: Get paginated list of all articles
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**:
```json
{
  "total": 50,
  "page": 1,
  "pages": 5,
  "articles": [
    {
      "_id": "article_id",
      "title": "Article Title",
      "source": "https://example.com",
      "bulletPoints": ["Point 1", "Point 2"],
      "aiAnswer": "AI answer content",
      "date": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 6. Search Articles
- **GET** `/api/articles/search`
- **Description**: Search articles by title or keywords
- **Query Parameters**:
  - `q`: Search query string
- **Response**:
```json
{
  "total": 5,
  "articles": [
    {
      "_id": "article_id",
      "title": "Matching Article Title",
      "source": "https://example.com",
      "bulletPoints": ["Point 1"],
      "aiAnswer": "Content",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7. Get Article by ID
- **GET** `/api/articles/:id`
- **Description**: Get a specific article by its ID
- **Response**:
```json
{
  "_id": "article_id",
  "title": "Article Title",
  "source": "https://example.com",
  "bulletPoints": ["Point 1", "Point 2"],
  "aiAnswer": "AI-generated content",
  "date": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 8. Update Article
- **PUT** `/api/articles/:id`
- **Description**: Update an existing article (requires authentication)
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**: Same as create article (any fields to update)
- **Response**:
```json
{
  "message": "Article updated",
  "article": {
    "_id": "article_id",
    "title": "Updated Title",
    // ... updated article data
  }
}
```

### 9. Delete Article
- **DELETE** `/api/articles/:id`
- **Description**: Delete an article (requires authentication)
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**:
```json
{
  "message": "Article deleted"
}
```

---

## 🔖 Bookmark APIs

### 10. Get User Bookmarks
- **GET** `/api/bookmarks`
- **Description**: Get all bookmarked articles for the current user
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**:
```json
{
  "bookmarks": [
    {
      "_id": "article_id",
      "title": "Bookmarked Article",
      "source": "https://example.com",
      "bulletPoints": ["Point 1"],
      "aiAnswer": "Content",
      "date": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 11. Add Bookmark
- **POST** `/api/bookmarks/:articleId`
- **Description**: Bookmark an article
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**:
```json
{
  "message": "Bookmark added",
  "bookmarks": ["article_id_1", "article_id_2"]
}
```

### 12. Remove Bookmark
- **DELETE** `/api/bookmarks/:articleId`
- **Description**: Remove an article from bookmarks
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response**:
```json
{
  "message": "Bookmark removed",
  "bookmarks": ["article_id_1"]
}
```

---

## 🧠 MCQ (Multiple Choice Questions) APIs

### 13. Generate or Get MCQs for Article
- **GET** `/api/mcqs/generate/:articleId`
- **Description**: Get existing MCQs or generate new ones using AI for an article
- **Response**:
```json
{
  "fromCache": false,
  "mcqs": [
    {
      "_id": "mcq_id",
      "articleId": "article_id",
      "question": "What is the main objective of VIKSIT BHARAT 2047?",
      "options": [
        "Economic development",
        "Social transformation",
        "Digital India",
        "All of the above"
      ],
      "correctAnswer": "All of the above",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 14. Submit MCQ Answers
- **POST** `/api/mcqs/submit`
- **Description**: Submit quiz answers and get results (requires authentication)
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
```json
{
  "articleId": "article_id",
  "answers": [
    {
      "mcqId": "mcq_id_1",
      "selected": "Option 1"
    },
    {
      "mcqId": "mcq_id_2",
      "selected": "Option 3"
    }
  ]
}
```
- **Response**:
```json
{
  "message": "Quiz submitted",
  "score": 3,
  "total": 5,
  "result": [
    {
      "mcqId": "mcq_id_1",
      "selected": "Option 1",
      "correct": true
    },
    {
      "mcqId": "mcq_id_2",
      "selected": "Option 3",
      "correct": false
    }
  ]
}
```

### 15. Check Quiz Attempt
- **GET** `/api/mcqs/attempt/:articleId`
- **Description**: Check if user has already attempted the quiz for an article
- **Headers**: `Authorization: Bearer <jwt_token>` (optional)
- **Response (if attempted)**:
```json
{
  "attempted": true,
  "score": 4,
  "total": 5,
  "result": [
    {
      "mcqId": "mcq_id",
      "selected": "Option 2",
      "correct": true
    }
  ]
}
```
- **Response (if not attempted)**:
```json
{
  "attempted": false
}
```

---

## 🤖 Gemini AI APIs

### 16. Test Gemini Integration
- **GET** `/api/gemini/test`
- **Description**: Test the Gemini AI integration with sample data
- **Response**:
```json
[
  {
    "question": "Sample question from Gemini AI?",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Option 2"
  }
]
```

### 17. Generate MCQs with Gemini
- **POST** `/api/gemini/generate`
- **Description**: Generate MCQs using Gemini AI for custom content
- **Body**:
```json
{
  "title": "Custom Topic",
  "content": "Content to generate MCQs from..."
}
```
- **Response**:
```json
{
  "title": "Custom Topic",
  "mcqs": [
    {
      "question": "Generated question based on content?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1"
    }
  ]
}
```

---

## 🏥 Health Check API

### 18. Health Check
- **GET** `/api/health`
- **Description**: Check if the API is running
- **Response**:
```json
{
  "ok": true
}
```

---

## 📊 Data Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  passwordHash: String (required),
  bookmarks: [ObjectId] (references to Articles),
  subscriptionStatus: String (enum: none, trial, active, expired),
  trialStartDate: Date,
  referralCode: String (unique),
  referredBy: String,
  streak: Number (default: 0),
  points: Number (default: 0),
  lastActiveAt: Date,
  roles: [String] (default: ["user"])
}
```

### Article Model
```javascript
{
  title: String (required),
  source: String,
  date: Date (default: Date.now),
  bulletPoints: [String],
  aiAnswer: String
}
```

### MCQ Model
```javascript
{
  articleId: ObjectId (required, references Article),
  question: String (required),
  options: [String] (exactly 4 options),
  correctAnswer: String (required)
}
```

### MCQAttempt Model
```javascript
{
  userId: ObjectId (required, references User),
  articleId: ObjectId (required, references Article),
  score: Number (required),
  total: Number (required),
  answers: [{
    mcqId: ObjectId (references MCQ),
    selected: String,
    correct: Boolean
  }]
}
```

---

## 🔒 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## ⚠️ Error Responses

All error responses follow this format:
```json
{
  "error": {
    "message": "Error description"
  }
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🚀 Getting Started

1. **Register a new user** using `/api/auth/register`
2. **Login** using `/api/auth/login` to get JWT token
3. **Create articles** using `/api/articles` (with auth)
4. **Generate MCQs** using `/api/mcqs/generate/:articleId`
5. **Take quizzes** using `/api/mcqs/submit` (with auth)
6. **Bookmark articles** using `/api/bookmarks/:articleId` (with auth)

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- Passwords are hashed using bcrypt
- MCQs are generated using Google Gemini AI
- Users can only attempt each quiz once
- Bookmarks are user-specific
- Trial users have limited access (7 days from registration)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.