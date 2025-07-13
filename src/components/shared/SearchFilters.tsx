import React, { useState } from "react";
import type { SearchFiltersProps } from "../../types";

const SearchFilters: React.FC<SearchFiltersProps> = ({
  onSearchByKeyword,
  onSearchByDate,
  resetDate,
}) => {
  // const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Search Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Search by Description
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Rent, Salary, Groceries"
              // value={keyword}
              onChange={(e) => onSearchByKeyword(e.target.value)}
              className="flex-1 border border-gray-300 bg-gray-50 text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            {/* <button
              onClick={() => onSearchByKeyword(keyword)}
              className="px-4 py-2 text-sm rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
            >
              Search
            </button> */}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Filter by Date
          </label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 bg-gray-50 text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 bg-gray-50 text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              onClick={() => onSearchByDate(startDate, endDate)}
              className="px-4 py-2 text-sm rounded bg-emerald-500 text-white hover:bg-emerald-600 transition"
            >
              Filter
            </button>

            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                resetDate();
              }}
              className="px-4 py-2 text-sm rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
