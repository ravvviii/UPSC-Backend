# Analytics API Documentation

## Quiz Analytics Endpoints

### 1. Get Quiz Attempt Analytics

**Endpoint:** `GET /api/analytics/quiz-attempts`

**Description:** Get detailed analytics about quiz attempts with user information from a specific date range.

**Query Parameters:**
- `startDate` (optional): Start date in ISO format (e.g., "2024-01-01")
- `endDate` (optional): End date in ISO format (e.g., "2024-12-31")
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 50)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Example Request:**
```bash
GET /api/analytics/quiz-attempts?startDate=2024-10-01&endDate=2024-10-31&page=1&limit=20
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalAttempts": 156,
      "uniqueUsersCount": 45,
      "dateRange": {
        "from": "2024-10-01",
        "to": "2024-10-31"
      },
      "pagination": {
        "currentPage": 1,
        "totalPages": 8,
        "hasNext": true,
        "hasPrev": false
      }
    },
    "attempts": [
      {
        "attemptId": "671a1234567890abcdef1234",
        "user": {
          "id": "671a1234567890abcdef5678",
          "username": "john_doe",
          "email": "john@example.com",
          "joinedAt": "2024-09-15T10:30:00.000Z"
        },
        "editorial": {
          "id": "671a1234567890abcdef9012",
          "title": "Current Affairs - October 2024",
          "category": "Politics"
        },
        "score": 8,
        "total": 10,
        "percentage": 80,
        "attemptedAt": "2024-10-24T14:30:00.000Z"
      }
    ],
    "userSummary": [
      {
        "_id": "671a1234567890abcdef5678",
        "username": "john_doe",
        "email": "john@example.com",
        "totalAttempts": 12,
        "totalScore": 89,
        "totalQuestions": 120,
        "averageScore": 7.42,
        "accuracyPercentage": 74.17,
        "lastAttempt": "2024-10-24T14:30:00.000Z",
        "firstAttempt": "2024-10-01T09:15:00.000Z"
      }
    ],
    "dailyStats": [
      {
        "date": "2024-10-24T00:00:00.000Z",
        "attemptCount": 8,
        "uniqueUsersCount": 6,
        "avgScore": 7.5
      }
    ]
  }
}
```

### 2. Get Top Performers

**Endpoint:** `GET /api/analytics/top-performers`

**Description:** Get top performing users in quiz attempts based on accuracy percentage.

**Query Parameters:**
- `startDate` (optional): Start date in ISO format
- `endDate` (optional): End date in ISO format
- `limit` (optional): Number of top performers to return (default: 10)

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Example Request:**
```bash
GET /api/analytics/top-performers?startDate=2024-10-01&limit=5
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "topPerformers": [
      {
        "_id": "671a1234567890abcdef5678",
        "username": "top_student",
        "email": "topstudent@example.com",
        "totalAttempts": 25,
        "totalScore": 230,
        "totalQuestions": 250,
        "averageScore": 9.2,
        "accuracyPercentage": 92.0,
        "bestScore": 10,
        "lastAttempt": "2024-10-24T14:30:00.000Z"
      }
    ],
    "dateRange": {
      "from": "2024-10-01",
      "to": "Now"
    }
  }
}
```

## Usage Examples

### 1. Get all quiz attempts from last 30 days
```bash
curl -X GET "http://localhost:4000/api/analytics/quiz-attempts?startDate=2024-09-24" \
  -H "Authorization: Bearer your-jwt-token"
```

### 2. Get quiz attempts for a specific date range with pagination
```bash
curl -X GET "http://localhost:4000/api/analytics/quiz-attempts?startDate=2024-10-01&endDate=2024-10-31&page=2&limit=25" \
  -H "Authorization: Bearer your-jwt-token"
```

### 3. Get top 20 performers
```bash
curl -X GET "http://localhost:4000/api/analytics/top-performers?limit=20" \
  -H "Authorization: Bearer your-jwt-token"
```

### 4. Get all-time analytics (no date filter)
```bash
curl -X GET "http://localhost:4000/api/analytics/quiz-attempts" \
  -H "Authorization: Bearer your-jwt-token"
```

## Features

✅ **User Information**: Username, email, join date
✅ **Quiz Attempt Details**: Score, total questions, percentage
✅ **Editorial Information**: Title and category
✅ **Date Range Filtering**: Flexible date filtering
✅ **Pagination**: Handle large datasets efficiently
✅ **User Summary**: Aggregated stats per user
✅ **Daily Statistics**: Day-wise attempt trends
✅ **Top Performers**: Leaderboard functionality
✅ **Authentication**: Protected endpoints
✅ **Accuracy Calculation**: Percentage-based performance metrics