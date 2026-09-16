import { Edit2, Trash2 } from "lucide-react";
import type { Expense } from "../../types";
import { formatCurrency } from "../../utils/currency";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

const ExpenseItem = ({ expense, onEdit, onDelete }: ExpenseItemProps) => {
  return (
    <tr>
      <td>
        <div style={{ fontWeight: 500 }}>{expense.title}</div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>{expense.description}</div>
      </td>
      <td>{expense.category}</td>
      <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
      <td style={{ fontWeight: 600 }}>{formatCurrency(expense.amount)}</td>
      <td>
        <div className="action-buttons">
          <button className="btn-icon" onClick={() => onEdit(expense)}>
            <Edit2 size={16} />
          </button>
          <button className="btn-icon" onClick={() => onDelete(expense.id)} style={{ color: "var(--color-danger)" }}>
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseItem;
