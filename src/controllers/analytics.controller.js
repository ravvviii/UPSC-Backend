import MCQAttempt from "../models/MCQAttempt.js";
import User from "../models/User.js";

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