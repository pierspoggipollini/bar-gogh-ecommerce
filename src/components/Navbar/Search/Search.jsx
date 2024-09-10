import {
  CloseOutlined,
  SearchOffOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useDebounce } from "use-debounce";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiBaseUrl from "../../../config/apiConfig";
import axios from "axios";
import logo from "../../images/logo/logo.png"
import FilterBy from "./FilterBy";
import SearchHistory from "./SearchHistory";
import SearchResults from "./SearchResults";

const Search = ({ activeSearch, setActiveSearch }) => {
  const SearchSchema = z.object({
    searchTerm: z
      .string()
      .min(3, "Search term must be at least 3 characters")
      .max(50, "Search term must not exceed 50 characters"),
  });

  const {
    register,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SearchSchema) });

  const searchTerm = watch("searchTerm", "");

  // Hook to debounce searchTerm updates
  const [debouncedTerm] = useDebounce(searchTerm, 500);

  // State for storing search results
  const [results, setResults] = useState([]);

  // State for storing search history
  const [searchHistory, setSearchHistory] = useState([]);

  // State to control visibility of cancel button in input field
  const [activeCancelInput, setActiveCancelInput] = useState(false);

  // State for filter selection
  const [filter, setFilter] = useState("all");

  // Function to load search history from sessionStorage
  const loadSearchHistory = () => {
    const savedHistory = sessionStorage.getItem("searchHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  };

  // Initialize search history when the component mounts
  useEffect(() => {
    setSearchHistory(loadSearchHistory());
  }, []);

  // Function to save search history to sessionStorage
  const saveSearchHistory = (history) => {
    sessionStorage.setItem("searchHistory", JSON.stringify(history));
  };

  // Function to fetch products based on search query
  const fetchSearchProducts = async (query) => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}products/search?searchTerm=${query}&filter=${filter}&limit=6`,
      );

      // Ensure Axios treats 404 as an error
      if (response.status !== 200) {
        throw new Error("Request failed with status " + response.status);
      }

      return response.data;
    } catch (error) {
      // Handle 404 error response
      if (error.response && error.response.status === 404) {
        throw new Error("No results found");
      } else {
        // Handle other errors
        throw new Error(
          error.response?.data?.message || "Error fetching products",
        );
      }
    }
  };

  // Function to handle search based on debounced search term
  const handleSearch = async (query) => {
    try {
      // Clear results and errors if search term is empty
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      const searchProductsData = await fetchSearchProducts(query);

      if (searchProductsData.length > 0) {
        setResults(searchProductsData);
        setError("root", null);
      } else {
        setResults([]);
        setError("searchTerm", {
          type: "custom",
          message: "No results found",
        });
      }
    } catch (error) {
      setError("searchTerm", {
        type: "custom",
        message: error.message, // Use error message from API response
      });
      setResults([]);
    }
  };

  // Function to clear search term and reset results and errors
  const clearErrors = () => {
    reset({
      searchTerm: "",
    });
    setResults([]);
    setActiveCancelInput(false);
  };

  // Effect to handle search when search term, filter, or search history changes
  useEffect(() => {
    if (debouncedTerm) {
      // Check if search term is already in current history
      const isDuplicate = searchHistory.some(
        (search) => search === debouncedTerm,
      );

      // If not a duplicate, update search history
      if (!isDuplicate) {
        const updatedHistory = [debouncedTerm, ...searchHistory.slice(0, 4)]; // Keep only the last 5 items
        setSearchHistory(updatedHistory);
        saveSearchHistory(updatedHistory);
      }

      handleSearch(debouncedTerm);
      setActiveCancelInput(true);
    } else {
      clearErrors();
    }
  }, [debouncedTerm, filter, searchHistory]);

  // Effect to toggle activeCancelInput based on searchTerm presence
  useEffect(() => {
    if (searchTerm) {
      setActiveCancelInput(true);
    } else {
      setActiveCancelInput(false);
    }
  }, [searchTerm]);

  // Function to clear entire search history
  const clearSearchHistory = () => {
    sessionStorage.removeItem("searchHistory");
    setSearchHistory([]);
  };

  // Function to prevent form submission on Enter key press
  const preventSubmitOnEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <AnimatePresence>
        {activeSearch && (
          <motion.div
            className="fixed w-full flex flex-col gap-4 z-50 my-0.5 py-4 min-h-[22.5rem] max-h-screen h-auto bg-slate-100"
            aria-live="polite"
          >
            <div className="flex w-full mt-2 justify-center">
              <img src={logo} alt="logo" className="w-auto h-16 md:h-20" />
            </div>
            <div
              onClick={() => {
                clearErrors();
                setActiveSearch(false);
              }}
              className="absolute justify-center cursor-pointer hover:bg-slate-200 rounded-full right-3 top-2 p-1"
              aria-label="Close search"
            >
              <SearchOffOutlined sx={{ fontSize: "40px" }} />
            </div>

            <div className="flex flex-1 justify-center">
              <form
                id="search-products"
                noValidate
                onSubmit={(e) => e.preventDefault()}
                className="relative flex flex-col gap-4 my-4 mx-3 w-full max-w-[35rem]"
                aria-label="Search products"
              >
                <button
                  className="absolute pointer-events-none p-1 top-2 left-2"
                  aria-hidden="true"
                >
                  <SearchOutlined
                    fontSize="medium"
                    className="text-slate-400"
                  />
                </button>
                {activeCancelInput && (
                  <button
                    onClick={clearErrors}
                    className="absolute rounded-full p-1 flex items-center hover:bg-slate-200 top-2 right-2"
                    aria-label="Clear search"
                  >
                    <CloseOutlined
                      fontSize="medium"
                      className="text-slate-600"
                    />
                  </button>
                )}

                <input
                  {...register("searchTerm")}
                  type="text"
                  placeholder="Search..."
                  id="searchTerm"
                  onKeyDown={preventSubmitOnEnter}
                  className={`min-w-full shadow-sm  transition duration-300 ease-in-out text-sm bg-transparent outline-none px-10 py-2 overflow-auto border-[1.5px] border-slate-300 h-12 rounded-lg ${
                    errors.searchTerm
                      ? " ring-red-600 focus:ring-2"
                      : "focus:ring focus:ring-orange-400 focus:ring-opacity-40"
                  }`}
                  aria-label="Search input"
                />

                <FilterBy value={filter} onFilterChange={setFilter} />

                {errors.searchTerm && (
                  <p className="text-red-600 text-xs" aria-live="assertive">
                    {errors.searchTerm.message}
                  </p>
                )}

                <SearchResults
                  results={results}
                  setActiveSearch={setActiveSearch}
                  clearErrors={clearErrors}
                />

                <SearchHistory
                  searchHistoryTerm={searchHistory}
                  clearSearchHistory={clearSearchHistory}
                />
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Search;
