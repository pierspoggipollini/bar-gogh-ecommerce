import { useEffect, useState } from "react";
import { useAvailableQuantity } from "../../ReactQuery/UseAvailableQuantity";
import { twMerge } from "tailwind-merge";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";


const SelectQty = ({
  selectedQuantity,
  classNameSpan,
  classNameSelect,
  colorIcon,
  productId,
  onChange,
}) => {
  const {
    data: availableQuantity,
    isLoading,
    error,
  } = useAvailableQuantity(productId);

  const [maxQuantity, setMaxQuantity] = useState(5);

  useEffect(() => {
    const fetchQuantity = async () => {
      try {
        if (typeof availableQuantity !== "undefined") {
          // Calculate the maximum selectable quantity (up to 5 or the available quantity)
          const maxSelectableQuantity = Math.min(5, availableQuantity);
          // Set maxQuantity with the calculated maxSelectableQuantity
          setMaxQuantity(maxSelectableQuantity);
        } else {
          // If availableQuantity is not defined, you might handle this based on application requirements
          console.warn("availableQuantity is undefined");
          setMaxQuantity(0); // Or set to 0 or a default value based on requirements
        }
      } catch (error) {
        // Handle errors that occur during quantity fetching
        console.error("Error fetching available quantity:", error);
        setMaxQuantity(0); // Set maxQuantity to 0 or a default value in case of error
      }
    };

    // Execute fetchQuantity when productId changes or availableQuantity changes
    fetchQuantity();
  }, [productId, availableQuantity]); // Add availableQuantity as a dependency to useEffect to run when it changes

  return (
    maxQuantity > 0 && (
      <div className="relative inline-block w-16 cursor-pointer text-sm">
        <select
          name="quantity"
          value={selectedQuantity}
          onChange={onChange}
          aria-label="Select Quantity"
          className={twMerge(
            `w-full max-w-14 cursor-pointer appearance-none border-b border-slate-400 bg-transparent pt-5  pb-0.5 text-base font-bold outline-none`,
            classNameSelect,
          )}
        >
          <optgroup label="Quantity">
            {[...Array(maxQuantity).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </optgroup>
        </select>
        <label className="pointer-events-none absolute top-auto left-0 w-[1px] overflow-hidden whitespace-nowrap pl-0 text-sm">
          Qty
        </label>
        <span
          className={twMerge(
            `pointer-events-none  absolute -top-1 left-0 pl-1 text-[10px] text-slate-100`,
            classNameSpan,
          )}
        >
          Qty
        </span>
        <span className="pointer-events-none absolute right-0 top-3">
          <KeyboardArrowDownOutlined
            sx={{ color: colorIcon }}
            fontSize="large"
            aria-hidden="true"
          />
        </span>
      </div>
    )
  );
};

export default SelectQty;