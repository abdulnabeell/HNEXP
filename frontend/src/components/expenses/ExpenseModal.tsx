import { useState, useEffect } from "react";
import Modal from "../common/Modal";

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: any) => void;
  initialData?: any;
  isSubmitting?: boolean;
}

const ExpenseModal = ({ isOpen, onClose, onSave, initialData, isSubmitting }: ExpenseModalProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setAmount("");
      setCategory("Food");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      amount: parseFloat(amount),
      category,
      description,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Expense" : "Add Expense"}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Title</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={isSubmitting} />
        </div>
        <div className="input-group">
          <label className="input-label">Amount (₹)</label>
          <input type="number" step="0.01" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={isSubmitting} />
        </div>
        <div className="input-group">
          <label className="input-label">Category</label>
          <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isSubmitting}>
            <option>Food</option>
            <option>Shopping</option>
            <option>Transport</option>
            <option>Utilities</option>
            <option>Other</option>
          </select>
        </div>
        <div className="input-group">
          <label className="input-label">Description (Optional)</label>
          <input className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSubmitting} />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (initialData ? "Saving..." : "Adding...") : (initialData ? "Save Changes" : "Add Expense")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
