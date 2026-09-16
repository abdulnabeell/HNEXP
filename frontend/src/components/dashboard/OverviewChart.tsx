import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ExpenseService } from "../../services/expense.service";
import type { ChartData } from "../../services/expense.service";
import { formatCurrency } from "../../utils/currency";

const OverviewChart = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ExpenseService.getChartData(period);
        setChartData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3>Spending Overview</h3>
        <select 
          className="input-field" 
          style={{ width: 'auto', padding: '6px 12px' }}
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          disabled={loading}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <div style={{ height: 300, width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
            Loading chart data...
          </div>
        ) : !chartData || chartData.data.length === 0 ? (
           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-secondary)' }}>
            No data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                cursor={{ fill: 'var(--color-secondary)' }}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', backgroundColor: 'var(--color-bg-card)' }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']}
              />
              <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default OverviewChart;
