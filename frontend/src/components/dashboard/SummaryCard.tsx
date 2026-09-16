import type { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

const SummaryCard = ({ title, value, icon }: SummaryCardProps) => {
  return (
    <div className="card summary-card">
      <div className="summary-label">
        <span style={{ color: "var(--color-primary)" }}>{icon}</span>
        {title}
      </div>
      <div className="summary-value">{value}</div>
    </div>
  );
};

export default SummaryCard;
