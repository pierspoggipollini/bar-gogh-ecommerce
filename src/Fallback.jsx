import React, { useCallback } from "react";

const Fallback = ({ error, resetErrorBoundary }) => {
     const reloadPage = useCallback(() => {
       window.location.reload();
     }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md text-balance w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">
          An unexpected error occurred. Please try again later.
        </p>
        {/* <pre className="text-red-600 mb-4">{error.message}</pre> */}
        <button
          onClick={() => {
            resetErrorBoundary();
            reloadPage(); 
          }}
          className=" bg-primary-btn hover:bg-primary-hover uppercase font-semibold rounded-lg text-slate-800 px-4 py-2  transition-colors duration-300"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default Fallback;
