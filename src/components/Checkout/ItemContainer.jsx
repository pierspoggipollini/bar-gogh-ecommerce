import images from "../images/images";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";
import { itemVariantsFooter } from "../utilities/variants";
import { motion } from "framer-motion";

// Definition of the ItemContainer component
export const ItemContainer = ({ image, price, title, category, quantity }) => {
    const formatAmount = useCurrencyFormatter();
  return (
    // Framer Motion div with animation variants
    <motion.div
      variants={itemVariantsFooter}
      className="max-w-md background rounded-lg bg-slate-200 h-[130px] lg:h-[120px] flex"
      role="listitem"
      aria-label={`${title} in ${category} category`}
    >
      {/* Container for the image */}
      <div className="p-3 rounded-lg">
        <div
          className="bg-slate-300 min-w-[5rem] w-28 max-w-28 h-full flex rounded-lg  justify-center"
          role="presentation"
        >
          {/* Item image */}
          <img
            src={images[image]}
            alt={title}
            className=" max-w-full overflow-hidden max-h-40"
          />
        </div>
      </div>

      {/* Container for item details */}
      <div className="flex justify-center pr-3 h-full w-full flex-col gap-1">
        {/* Category text */}
        <span className="text-[11px] line-clamp-1 leading-tight">
          {category}
        </span>

        {/* Item title */}
        <h2 className="font-semibold line-clamp-1 break-words whitespace-normal max-w-[250px] text-sm">
          {title}
        </h2>

        {/* Container for quantity and price */}
        <div className="flex flex-col gap-1 mt-2">
          {/* Quantity text */}
          <span className="text-[12px]">Quantity ({quantity})</span>

          {/* Item price */}
          <b className="text-sm font-semibold tabular-nums">
            {formatAmount(price)}
          </b>
        </div>
      </div>
    </motion.div>
  );
};
