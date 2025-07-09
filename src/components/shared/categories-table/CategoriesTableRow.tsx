import { Pencil, Trash2 } from "lucide-react";
import type { TableRowProps } from "../../../types";
import DateCell from "../DateCell";

const CategoriesTableRow: React.FC<TableRowProps> = ({
  row,
  showActions,
  onEditClick,
  onDeleteClick,
}) => (
  <tr>
    <td className="px-4 py-3 border border-gray-200 capitalize">
      <DateCell date={row.date} />
    </td>
    <td className="px-4 py-3 border border-gray-200 capitalize">
      {row.category}
    </td>

    <td className="px-4 py-3 border border-gray-200 capitalize">{row.type}</td>

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

export default CategoriesTableRow;
