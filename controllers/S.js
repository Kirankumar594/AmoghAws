import Order from "../models/Order.js"
import User from "../models/userModel.js"
import MedicalHardware from "../models/MedicalHardware.js"

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private/Admin
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get date range (default to last 30 days)
    const { days = 30 } = req.query
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    // Parallel queries for better performance
    const [totalOrders, totalRevenue, totalUsers, totalProducts, recentOrders, ordersByStatus, dailySales] =
      await Promise.all([
        Order.countDocuments(),
        Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
        User.countDocuments(),
        MedicalHardware.countDocuments(),
        Order.find().sort({ createdAt: -1 }).limit(10).populate("user._id", "name email"),
        Order.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
        Order.aggregate([
          {
            $match: {
              createdAt: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              sales: { $sum: "$total" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]),
      ])

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate)
    prevStartDate.setDate(prevStartDate.getDate() - Number.parseInt(days))

    const [prevOrders, prevRevenue] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: prevStartDate, $lt: startDate },
      }),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: prevStartDate, $lt: startDate },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ])

    // Calculate percentage changes
    const currentRevenue = totalRevenue[0]?.total || 0
    const previousRevenue = prevRevenue[0]?.total || 0
    const revenueChange =
      previousRevenue > 0 ? (((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1) : 0

    const ordersChange = prevOrders > 0 ? (((totalOrders - prevOrders) / prevOrders) * 100).toFixed(1) : 0

    res.json({
      success: true,
      data: {
        stats: {
          totalRevenue: currentRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
          revenueChange: Number.parseFloat(revenueChange),
          ordersChange: Number.parseFloat(ordersChange),
        },
        recentOrders,
        ordersByStatus,
        dailySales,
        period: `${days} days`,
      },
    })
  } catch (error) {
    console.error("Dashboard analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard analytics",
    })
  }
}

// @desc    Get sales analytics
// @route   GET /api/dashboard/sales
// @access  Private/Admin
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = "7d" } = req.query
    let days = 7

    switch (period) {
      case "30d":
        days = 30
        break
      case "90d":
        days = 90
        break
      default:
        days = 7
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      success: true,
      data: salesData,
    })
  } catch (error) {
    console.error("Sales analytics error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching sales analytics",
    })
  }
}
