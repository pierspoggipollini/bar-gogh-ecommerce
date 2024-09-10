import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "./components/utilities/capitalizeFirstLetter";

const Breadcrumb = () => {
  // Get the current location from React Router
  const location = useLocation();

  // Split the pathname into an array of path segments
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex mt-8 mx-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-1 pb-1 items-center rtl:space-x-reverse">
        {/* Render the home breadcrumb */}
        <li className="inline-flex items-center">
          <RouterLink
            aria-label="Home"
            to="/"
            className="inline-flex items-center text-xs font-medium text-neutral-300 hover:text-neutral-200"
          >
            <svg
              className="w-4 h-4 me-1"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
          </RouterLink>
        </li>

        {/* Render each breadcrumb segment dynamically */}
        {pathnames.map((name, index) => {
          // Construct the route to each breadcrumb segment
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name}>
              <div className="flex items-center">
                {/* Arrow icon for separation */}
                <svg
                  className="rtl:rotate-180 w-3 h-3 text-neutral-300 mx-1"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>

                {/* Render the breadcrumb segment */}
                {isLast ? (
                  // Display the current segment as plain text if it's the last one
                  <span className="ms-1 text-xs font-medium text-neutral-100 md:ms-2">
                    {capitalizeFirstLetter(name)}
                  </span>
                ) : (
                  // Render a link to the current segment if it's not the last one
                  <RouterLink
                    aria-label={`Link to ${routeTo}`}
                    to={routeTo}
                    className="ms-1 text-xs font-medium text-neutral-300 hover:text-neutral-200 md:ms-2"
                  >
                    {capitalizeFirstLetter(name)}
                  </RouterLink>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;


