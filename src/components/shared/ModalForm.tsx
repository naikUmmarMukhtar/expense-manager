import React, { useState, useEffect } from "react";
import type { ModalFormProps } from "../../types";

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  initialData,
}) => {
  const [formData, setFormData] = useState({ description: "", amount: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || "",
        amount: initialData.amount?.toString() || "",
      });
    } else {
      setFormData({ description: "", amount: "" });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  console.log(initialData, "before ...");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      ...initialData,
      ...formData,
      type,
    };
    console.log(initialData, "after ...");

    onSubmit(data);
    setFormData({ description: "", amount: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {initialData ? "Edit Income" : `Add ${type}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              name="description"
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              name="amount"
              onChange={handleChange}
              placeholder="Enter amount"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Type
            </label>
            <input
              type="text"
              value={type}
              disabled
              className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
            >
              {initialData ? "Update" : `Add`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
