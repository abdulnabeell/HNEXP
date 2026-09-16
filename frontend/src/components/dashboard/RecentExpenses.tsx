import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, ShoppingBag, Zap, Car, Receipt } from "lucide-react";
import { ExpenseService } from "../../services/expense.service";
import type { Expense } from "../../types";
import { formatCurrency } from "../../utils/currency";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Food': return <Coffee size={18} />;
    case 'Shopping': return <ShoppingBag size={18} />;
    case 'Utilities': return <Zap size={18} />;
    case 'Transport': return <Car size={18} />;
    default: return <Receipt size={18} />;
  }
};

const RecentExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await ExpenseService.getExpenses();
        setExpenses(data.slice(0, 5)); // get latest 5
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="recent-expenses-section">
      <div className="recent-header">
        <h3>Recent Expenses</h3>
        <Link to="/expenses" className="auth-link" style={{ fontSize: 14 }}>View All</Link>
      </div>
      {loading ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading...</div>
      ) : expenses.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)' }}>No expenses yet.</div>
      ) : (
        <div className="expense-list">
          {expenses.map((expense) => (
            <div key={expense.id} className="expense-list-item">
              <div className="expense-item-left">
                <div className="expense-item-icon">{getCategoryIcon(expense.category)}</div>
                <div>
                  <div className="expense-item-title">{expense.title}</div>
                  <div className="expense-item-date">{expense.category} • {new Date(expense.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="expense-item-right">
                <div className="expense-item-amount" style={{ fontWeight: 600 }}>− {formatCurrency(expense.amount)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;
