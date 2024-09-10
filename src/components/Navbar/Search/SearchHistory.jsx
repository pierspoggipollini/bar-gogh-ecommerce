import React from "react";

const SearchHistory = ({ searchHistoryTerm, clearSearchHistory }) => {
  return (
    <>
      {searchHistoryTerm && searchHistoryTerm.length > 0 ? (
        <div className="grid gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-slate-600">Search History</h3>
            <button
              onClick={clearSearchHistory}
              className="text-xs text-slate-700 hover:underline hover:underline-offset-2"
            >
              Reset everything
            </button>
          </div>

          <ul className="flex flex-col flex-wrap overflow-hidden text-sm gap-2">
            {searchHistoryTerm.map((term, index) => (
              <li className="rounded-lg" key={index}>
                {term}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="text-xs text-slate-600">
            Currently, there is no search history available.
          </h3>
        </div>
      )}
    </>
  );
};

export default SearchHistory;
