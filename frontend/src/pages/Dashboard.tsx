import { useEffect, useState } from "react";
import { Receipt, TrendingDown, Award } from "lucide-react";
import SummaryCard from "../components/dashboard/SummaryCard";
import OverviewChart from "../components/dashboard/OverviewChart";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import { ExpenseService } from "../services/expense.service";
import type { ExpenseSummary } from "../services/expense.service";
import { formatCurrency } from "../utils/currency";

const Dashboard = () => {
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await ExpenseService.getSummary();
        setSummary(data);
      } catch (err) {
        setError("Failed to load dashboard summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 40 }}>
        <div>
          <h2 style={{ fontSize: 14, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <h1 className="page-title" style={{ fontSize: 32, marginBottom: 8 }}>Your spending at a glance.</h1>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading dashboard...</div>
      ) : error ? (
        <div className="auth-error">{error}</div>
      ) : summary ? (
        <>
          <div className="card" style={{ marginBottom: 'var(--spacing-xl)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 12 }}>
              TOTAL SPENDING
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
              {formatCurrency(summary.totalSpending)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--color-text-secondary)' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                backgroundColor: summary.monthlyChange === null || summary.monthlyChange === 0 ? 'var(--color-secondary)' : (summary.monthlyChange > 0 ? 'var(--color-danger-bg)' : 'var(--color-success-bg)'), 
                color: summary.monthlyChange === null || summary.monthlyChange === 0 ? 'var(--color-text-secondary)' : (summary.monthlyChange > 0 ? 'var(--color-danger)' : 'var(--color-success)'), 
                padding: '2px 8px', 
                borderRadius: 4, 
                fontWeight: 500, 
                fontSize: 12 
              }}>
                {summary.monthlyChange === null 
                  ? "—" 
                  : `${summary.monthlyChange > 0 ? '↑' : (summary.monthlyChange < 0 ? '↓' : '')} ${Math.abs(summary.monthlyChange).toFixed(1)}%`}
              </span>
              from last month
            </div>
          </div>

          <div className="summary-grid">
            <SummaryCard 
              title="TOTAL EXPENSES" 
              value={summary.totalExpenses.toString()} 
              icon={<Receipt size={20} />} 
            />
            <SummaryCard 
              title="AVERAGE EXPENSE" 
              value={formatCurrency(summary.averageExpense)} 
              icon={<TrendingDown size={20} />} 
            />
            <SummaryCard 
              title="TOP CATEGORY" 
              value={summary.topCategory ? summary.topCategory.name : "None"} 
              icon={<Award size={20} />} 
            />
          </div>

          <div className="dashboard-layout">
            <OverviewChart />
            <RecentExpenses />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Dashboard;
