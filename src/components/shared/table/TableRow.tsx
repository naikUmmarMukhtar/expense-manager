import { Pencil, Trash2 } from "lucide-react";
import type { TableRowProps } from "../../../types";
import DateCell from "../DateCell";

const TableRow: React.FC<TableRowProps> = ({
  row,
  showActions,
  onEditClick,
  onDeleteClick,
}) => (
  <tr>
    <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
      <DateCell date={row.date} />
    </td>
    <td className="px-4 py-3 border border-gray-200">{row.description}</td>
    <td className="px-4 py-3 border border-gray-200 capitalize">{row.type}</td>
    <td className="px-4 py-3 border border-gray-200 font-medium text-right text-gray-700">
      ₹{row.amount}
    </td>
    {showActions && (
      <td className="px-4 py-3 border border-gray-200 text-right whitespace-nowrap">
        <button
          onClick={onEditClick}
          className="inline-flex items-center text-gray-700 hover:underline mr-4"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDeleteClick}
          className="inline-flex items-center text-gray-700 hover:underline"
        >
          <Trash2 className="w-4 h-4 mr-1 text-red-600" />
        </button>
      </td>
    )}
  </tr>
);
export default TableRow;
