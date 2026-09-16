import ExpenseItem from "./ExpenseItem";

interface ExpenseListProps {
  expenses: any[];
  onEdit: (expense: any) => void;
  onDelete: (id: number) => void;
}

const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  return (
    <div className="expense-table-wrapper">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Category</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--color-text-secondary)" }}>
                No expenses found.
              </td>
            </tr>
          ) : (
            expenses.map(expense => (
              <ExpenseItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
