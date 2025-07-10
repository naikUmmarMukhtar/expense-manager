import { useEffect, useState } from "react";
import type { CategoryModalProps } from "../../types";

function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: CategoryModalProps) {
  const [category, setCategory] = useState({ category: "", type: "" });

  useEffect(() => {
    if (initialData) {
      setCategory({
        category: initialData.category || "",
        type: initialData.type || "",
      });
    } else {
      setCategory({ category: "", type: "" });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...initialData,
        ...category,
        date: new Date(),
      });
      setCategory({ category: "", type: "" });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <input
              className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
              value={category.category}
              onChange={handleChange}
              placeholder="Enter category Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Type</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-2 text-gray-800"
              value={category.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="incomes">Income</option>
              <option value="expenses">Expense</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-rose-500 text-white px-4 py-2 rounded-xl hover:bg-rose-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CategoryModal;
