const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const dashboardService = require("../services/dashboardService");

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Dashboard principal
router.get("/summary", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dashboardData = await dashboardService.getDashboardSummary(userId);

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Balanço
router.get("/balance", async (req, res, next) => {
  try {
    const balanceData = await dashboardService.getAccountBalance(req.user.id);

    res.json({
      success: true,
      data: balanceData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Transações recentes
router.get("/recent-transactions", async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const transactions = await dashboardService.getRecentTransactions(
      req.user.id,
      parseInt(limit),
    );

    res.json({
      success: true,
      data: transactions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
