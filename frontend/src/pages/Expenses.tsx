import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseModal from "../components/expenses/ExpenseModal";
import Modal from "../components/common/Modal";
import { ExpenseService } from "../services/expense.service";
import type { Expense } from "../types";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await ExpenseService.getExpenses(debouncedSearch, category);
      setExpenses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [debouncedSearch, category]);

  const handleSave = async (expenseData: any) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await ExpenseService.updateExpense(editingExpense.id, {
          title: expenseData.title,
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
        });
      } else {
        await ExpenseService.createExpense({
          title: expenseData.title,
          amount: expenseData.amount,
          category: expenseData.category,
          description: expenseData.description,
        });
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Failed to save expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await ExpenseService.deleteExpense(deletingId);
      setIsConfirmOpen(false);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert("Failed to delete expense.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Manage and track your transactions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      <div className="filters-bar">
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 12px', flex: 1 }}>
          <Search size={18} color="var(--color-text-secondary)" />
          <input 
            type="text" 
            placeholder="Search expenses..." 
            style={{ border: 'none', background: 'none', padding: '10px', width: '100%', outline: 'none', fontSize: 14, color: 'var(--color-text-primary)' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="input-field" 
          style={{ width: 'auto', marginBottom: 0 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Shopping">Shopping</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ marginBottom: 16, color: 'var(--color-text-secondary)' }}>
            No expenses yet. Start tracking your spending by adding your first expense.
          </div>
          <button className="btn btn-secondary" onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Add expense
          </button>
        </div>
      ) : (
        <ExpenseList 
          expenses={expenses} 
          onEdit={handleEdit} 
          onDelete={handleDeleteClick} 
        />
      )}

      {isModalOpen && (
        <ExpenseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
          initialData={editingExpense} 
          isSubmitting={isSubmitting}
        />
      )}

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Delete Expense">
        <p style={{ marginBottom: '24px' }}>Are you sure you want to delete this expense? This action cannot be undone.</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setIsConfirmOpen(false)} disabled={isDeleting}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
