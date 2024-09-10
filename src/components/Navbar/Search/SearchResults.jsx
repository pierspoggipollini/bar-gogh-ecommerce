import { ArrowRightAltOutlined } from "@mui/icons-material";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchResults = ({ results, clearErrors, setActiveSearch }) => {
  const navigate = useNavigate();

  const handleItemClick = (productId) => {
    clearErrors();
    setActiveSearch(false);
    navigate(`/products/${productId}`);
  };
  
  const breakLine = `after:h-2 after:flex-1 after:flex after:flex-shrink-0 after:border-b-2 after:border-solid after:border-slate-300 after:my-2 after:content-['']`;
  return (
    <>
      {results.length > 0 && (
        <div className="grid gap-3">
          <h3 className="text-xs text-slate-600">Results</h3>
          <ul className="flex flex-col gap-2 flex-wrap overflow-hidden text-sm ">
            {results.map((result, index) => (
              <li
                className="flex group cursor-pointer items-center justify-between"
                key={index}
                onClick={() => handleItemClick(result.id)}
              >
                <Link
                  className="hover:underline group-hover:underline group-hover:underline-offset-2 hover:underline-offset-2"
                  to={`/products/${result.id}`}
                >
                  {result.title}
                </Link>

                <ArrowRightAltOutlined className="text-slate-600" />
              </li>
            ))}
          </ul>
          <div className={breakLine}></div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
