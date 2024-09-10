import React from "react";
import HorizontalRuleOutlinedIcon from "@mui/icons-material/HorizontalRuleOutlined";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const CardCategories = ({ image, title, link }) => {
  const navigate = useNavigate();
  return (
    <motion.figure
      onClick={() => navigate(link)}
      aria-label={title}
      role="link"
      className={` relative shadow-lg cursor-pointer  rounded-md grid h-60 w-full place-items-center 
       sm:w-96 `}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full overflow-hidden object-cover "
      />
      <div className=" absolute inset-0 bg-black opacity-50"></div>
      <figcaption className="absolute opacity-100 w-full p-2 text-center hover:scale-110 hover:transition hover:ease-in-out hover:duration-500 text-sm text-slate-100 lg:text-base">
        <Link
          to={link}
          aria-label={`Link to ${title}`}
          className="grid place-items-center"
        >
          {title}
          <HorizontalRuleOutlinedIcon />
          View More
        </Link>
      </figcaption>
    </motion.figure>
  );
};
