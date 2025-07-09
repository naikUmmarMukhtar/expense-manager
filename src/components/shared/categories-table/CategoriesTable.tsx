import { Plus } from "lucide-react";
import type { TableProps } from "../../../types";
import CategoriesTableRow from "./CategoriesTableRow";

const CategoriesTable: React.FC<TableProps> = ({
  data,
  showActionsColumn,
  showActionButton,
  actionButtonLabel,
  onActionButtonClick,
  onEditButtonClick,
  onDeleteButtonClick,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg bg-white p-6">
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

      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3 border border-gray-200">Date</th>
              <th className="px-4 py-3 border border-gray-200">Category</th>
              <th className="px-4 py-3 border border-gray-200">Type</th>
              {showActionsColumn && (
                <th className="px-4 py-3 border border-gray-200 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {data?.map((row, i) => (
              <CategoriesTableRow
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

export default CategoriesTable;
