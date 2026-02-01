// Simulação de dados para demonstração
const getDashboardSummary = async (userId) => {
  // Em produção, aqui você chamaria APIs externas
  return {
    totalBalance: 125430.87,
    availableBalance: 85430.87,
    investmentsValue: 40000.0,
    creditCardLimit: 15000.0,
    creditCardUsed: 3245.5,
    monthlyIncome: 18500.0,
    monthlyExpenses: 12450.75,
    savingsRate: 0.33,
    cards: [
      { type: "credit", lastDigits: "4321", dueDate: "2024-01-10" },
      { type: "debit", lastDigits: "8765" },
    ],
    notifications: 4,
    quickActions: [
      { id: 1, name: "Transferir", icon: "send", path: "/transfers" },
      { id: 2, name: "Pagar", icon: "credit-card", path: "/payments" },
      { id: 3, name: "Investir", icon: "trending-up", path: "/investments" },
      { id: 4, name: "Extrato", icon: "file-text", path: "/statement" },
    ],
  };
};

const getAccountBalance = async (userId) => {
  return {
    checking: {
      balance: 85430.87,
      available: 85430.87,
      lastUpdate: "2024-01-05T10:30:00Z",
    },
    savings: {
      balance: 25000.0,
      available: 25000.0,
      yield: 0.85,
      lastUpdate: "2024-01-05T10:30:00Z",
    },
    investments: {
      total: 40000.0,
      variation: 2.34,
      lastUpdate: "2024-01-05T10:30:00Z",
    },
    credit: {
      availableLimit: 11754.5,
      totalLimit: 15000.0,
      nextDueDate: "2024-01-10",
      lastUpdate: "2024-01-05T10:30:00Z",
    },
  };
};

const getRecentTransactions = async (userId, limit = 10) => {
  const transactions = [
    {
      id: 1,
      date: "2024-01-05T09:15:00Z",
      description: "Supermercado",
      amount: -245.8,
      category: "alimentacao",
      type: "debit",
    },
    {
      id: 2,
      date: "2024-01-04T14:30:00Z",
      description: "Salário",
      amount: 8500.0,
      category: "receita",
      type: "credit",
    },
    {
      id: 3,
      date: "2024-01-03T19:45:00Z",
      description: "Restaurante",
      amount: -120.5,
      category: "alimentacao",
      type: "debit",
    },
    {
      id: 4,
      date: "2024-01-02T11:20:00Z",
      description: "Transferência Recebida",
      amount: 500.0,
      category: "transferencia",
      type: "credit",
    },
    {
      id: 5,
      date: "2024-01-01T08:00:00Z",
      description: "Netflix",
      amount: -39.9,
      category: "entretenimento",
      type: "debit",
    },
  ];

  return transactions.slice(0, limit);
};

module.exports = {
  getDashboardSummary,
  getAccountBalance,
  getRecentTransactions,
};
