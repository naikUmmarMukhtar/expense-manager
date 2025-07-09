import { Plus } from "lucide-react";
import type { TableProps } from "../../../types";
import TableRow from "./TableRow";

const Table: React.FC<TableProps> = ({
  data,
  showActionsColumn,
  showActionButton,
  actionButtonLabel,
  onActionButtonClick,
  onEditButtonClick,
  onDeleteButtonClick,
  incomeTotal,
  expenseTotal,
  showTotal,
}) => {
  const netBalance = (incomeTotal ?? 0) - (expenseTotal ?? 0);
  const totalTransactions = data?.length || 0;
  const totalTransactionAmount = (incomeTotal ?? 0) + (expenseTotal ?? 0);

  return (
    <div
      className="overflow-x-auto 
    rounded-lg bg-white p-6"
    >
      {showActionButton && actionButtonLabel && (
        <div className="flex justify-end mb-4">
          <button
            onClick={onActionButtonClick}
            className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 transition"
          >
            <Plus className="w-4 h-4" />
            {actionButtonLabel}
          </button>
        </div>
      )}

      {(incomeTotal || expenseTotal) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6 text-gray-700">
          <div className="bg-green-50 p-4 rounded shadow-sm">
            <p className="font-semibold">Total Income</p>
            <p className="text-green-700 font-medium">
              ₹{(incomeTotal ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded shadow-sm">
            <p className="font-semibold">Total Expense</p>
            <p className="text-red-700 font-medium">
              ₹{(expenseTotal ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded shadow-sm">
            <p className="font-semibold">Transactions</p>
            <p className="text-yellow-800 font-medium">{totalTransactions}</p>
          </div>
          <div
            className={`p-4 rounded shadow-sm ${
              netBalance >= 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-semibold">Net Balance</p>
            <p className="font-medium">₹{netBalance.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3 border border-gray-200">Date</th>
              <th className="px-4 py-3 border border-gray-200">Description</th>
              <th className="px-4 py-3 border border-gray-200">Category</th>
              <th className="px-4 py-3 border border-gray-200 text-right">
                Amount
                {showTotal && (
                  <span className="ml-1 text-xs text-gray-500 font-normal">
                    (₹{totalTransactionAmount.toFixed(2)})
                  </span>
                )}
              </th>
              {showActionsColumn && (
                <th className="px-4 py-3 border border-gray-200 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {data?.map((row, i) => (
              <TableRow
                key={i}
                row={row}
                showActions={showActionsColumn}
                onEditClick={() => onEditButtonClick?.(row)}
                onDeleteClick={() => onDeleteButtonClick?.(row)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
