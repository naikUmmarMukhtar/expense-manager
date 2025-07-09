import { FolderPlus, PlusCircle } from "lucide-react";
import type { NoDataProps } from "../../types";

export default function NoData({
  title = "Nothing Here Yet",
  description = "Start by adding your first entry. It’ll show up here once created.",
  onAddTransaction,
  buttonLabel,
  showIncomeAction,
}: NoDataProps) {
  return (
    <div className="flex items-center justify-center h-full w-full px-4">
      <div className="flex flex-col items-center text-center p-10 bg-white border border-zinc-200 rounded-xl shadow-sm max-w-fit w-full">
        <div className="bg-zinc-100 p-4 rounded-full mb-4">
          <FolderPlus className="h-8 w-8 text-zinc-400" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-800">{title}</h2>
        <p className="text-sm text-zinc-500 mt-2">{description}</p>

        <div className="flex gap-6 mt-4 text-sm font-medium">
          {showIncomeAction && (
            <div
              onClick={onAddTransaction}
              className="flex items-center gap-1 text-emerald-600 cursor-pointer hover:underline transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>{buttonLabel}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
