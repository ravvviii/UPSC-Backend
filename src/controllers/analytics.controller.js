import MCQAttempt from "../models/MCQAttempt.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// Get quiz attempt analytics with user details
export const getQuizAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, page = 1, limit = 50 } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get quiz attempts with user details
    const attempts = await MCQAttempt.find(dateFilter)
      .populate({
        path: 'userId',
        select: 'username email createdAt',
        model: 'User'
      })
      .populate({
        path: 'editorialId',
        select: 'title category',
        model: 'Editorial'
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalAttempts = await MCQAttempt.countDocuments(dateFilter);

    // Get unique users count who attempted quizzes
    const uniqueUsersCount = await MCQAttempt.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$userId" } },
      { $count: "uniqueUsers" }
    ]);

    // Get user-wise attempt summary
    const userSummary = await MCQAttempt.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$userId",
          totalAttempts: { $sum: 1 },
          totalScore: { $sum: "$score" },
          totalQuestions: { $sum: "$total" },
          averageScore: { $avg: "$score" },
          lastAttempt: { $max: "$createdAt" },
          firstAttempt: { $min: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 1,
          username: "$userDetails.username",
          email: "$userDetails.email",
          totalAttempts: 1,
          totalScore: 1,
          totalQuestions: 1,
          averageScore: { $round: ["$averageScore", 2] },
          accuracyPercentage: { 
            $round: [
              { $multiply: [{ $divide: ["$totalScore", "$totalQuestions"] }, 100] }, 
              2
            ] 
          },
          lastAttempt: 1,
          firstAttempt: 1
        }
      },
      { $sort: { totalAttempts: -1, averageScore: -1 } }
    ]);

    // Get daily quiz attempt stats
    const dailyStats = await MCQAttempt.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          attemptCount: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
          avgScore: { $avg: "$score" }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            }
          },
          attemptCount: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          avgScore: { $round: ["$avgScore", 2] }
        }
      },
      { $sort: { date: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalAttempts,
          uniqueUsersCount: uniqueUsersCount[0]?.uniqueUsers || 0,
          dateRange: {
            from: startDate || "Beginning",
            to: endDate || "Now"
          },
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalAttempts / limit),
            hasNext: offset + attempts.length < totalAttempts,
            hasPrev: page > 1
          }
        },
        attempts: attempts.map(attempt => ({
          attemptId: attempt._id,
          user: {
            id: attempt.userId?._id,
            username: attempt.userId?.username,
            email: attempt.userId?.email,
            joinedAt: attempt.userId?.createdAt
          },
          editorial: {
            id: attempt.editorialId?._id,
            title: attempt.editorialId?.title,
            category: attempt.editorialId?.category
          },
          score: attempt.score,
          total: attempt.total,
          percentage: Math.round((attempt.score / attempt.total) * 100),
          attemptedAt: attempt.createdAt
        })),
        userSummary,
        dailyStats
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get top performers in quiz attempts
export const getTopPerformers = async (req, res, next) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) {
        dateFilter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.createdAt.$lte = new Date(endDate);
      }
    }

    const topPerformers = await MCQAttempt.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: "$userId",
          totalAttempts: { $sum: 1 },
          totalScore: { $sum: "$score" },
          totalQuestions: { $sum: "$total" },
          averageScore: { $avg: "$score" },
          bestScore: { $max: "$score" },
          lastAttempt: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 1,
          username: "$userDetails.username",
          email: "$userDetails.email",
          totalAttempts: 1,
          totalScore: 1,
          totalQuestions: 1,
          averageScore: { $round: ["$averageScore", 2] },
          accuracyPercentage: { 
            $round: [
              { $multiply: [{ $divide: ["$totalScore", "$totalQuestions"] }, 100] }, 
              2
            ] 
          },
          bestScore: 1,
          lastAttempt: 1
        }
      },
      { $sort: { accuracyPercentage: -1, totalAttempts: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: {
        topPerformers,
        dateRange: {
          from: startDate || "Beginning",
          to: endDate || "Now"
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// Get quiz attempts by specific user ID (unprotected route)
export const getUserQuizAttempts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format"
      });
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get user's quiz attempts with editorial details
    const attempts = await MCQAttempt.find({ userId })
      .populate({
        path: 'userId',
        select: 'username email createdAt',
        model: 'User'
      })
      .populate({
        path: 'editorialId', 
        select: 'title category content',
        model: 'Editorial'
      })
      .sort({ createdAt: -1 }) // Latest first
      .skip(offset)
      .limit(parseInt(limit));

    // Get total count for this user
    const totalAttempts = await MCQAttempt.countDocuments({ userId });

    // Check if user exists
    if (attempts.length === 0 && totalAttempts === 0) {
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }
    }

    // Calculate user statistics
    const userStats = await MCQAttempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          totalScore: { $sum: "$score" },
          totalQuestions: { $sum: "$total" },
          averageScore: { $avg: "$score" },
          bestScore: { $max: "$score" },
          worstScore: { $min: "$score" },
          firstAttempt: { $min: "$createdAt" },
          lastAttempt: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          _id: 0,
          totalAttempts: 1,
          totalScore: 1,
          totalQuestions: 1,
          averageScore: { $round: ["$averageScore", 2] },
          accuracyPercentage: { 
            $round: [
              { $multiply: [{ $divide: ["$totalScore", "$totalQuestions"] }, 100] }, 
              2
            ] 
          },
          bestScore: 1,
          worstScore: 1,
          firstAttempt: 1,
          lastAttempt: 1
        }
      }
    ]);

    // Get user basic info
    const userInfo = attempts.length > 0 ? attempts[0].userId : await User.findById(userId).select('username email createdAt');

    res.json({
      success: true,
      data: {
        user: {
          id: userId,
          username: userInfo?.username,
          email: userInfo?.email,
          joinedAt: userInfo?.createdAt
        },
        statistics: userStats[0] || {
          totalAttempts: 0,
          totalScore: 0,
          totalQuestions: 0,
          averageScore: 0,
          accuracyPercentage: 0,
          bestScore: 0,
          worstScore: 0,
          firstAttempt: null,
          lastAttempt: null
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalAttempts / limit),
          totalAttempts,
          hasNext: offset + attempts.length < totalAttempts,
          hasPrev: page > 1,
          limit: parseInt(limit)
        },
        attempts: attempts.map(attempt => ({
          attemptId: attempt._id,
          editorial: {
            id: attempt.editorialId?._id,
            title: attempt.editorialId?.title,
            category: attempt.editorialId?.category,
            content: attempt.editorialId?.content?.substring(0, 200) + "..." // Preview only
          },
          score: attempt.score,
          total: attempt.total,
          percentage: Math.round((attempt.score / attempt.total) * 100),
          answers: attempt.answers,
          attemptedAt: attempt.createdAt,
          timeAgo: getTimeAgo(attempt.createdAt)
        }))
      }
    });

  } catch (error) {
    next(error);
  }
};

// Helper function to calculate time ago
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};