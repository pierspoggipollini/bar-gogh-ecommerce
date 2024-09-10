import React from "react";
import { Link } from "react-router-dom";
import images from "../../images/images";
import shippingData from "../../../store/shippingData";
import { NavigateButton } from "../NavigateButton";
import { Skeleton } from "@mui/material";

const OrdersSkeleton = ({}) => {
  const line = (
    <div className="flex pb-2 after:w-32 after:flex-1 after:flex-shrink-0 after:border-b-slate-400 after:border after:border-slate-100 after:content-['']"></div>
  );
  return (
    <>
      <div className="bg-slate-100 p-4 rounded-lg">
        <div className="flex max-w-md h-auto gap-1 py-2 flex-col">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: "1rem", bgcolor: "grey.400" }}
                width={130}
              />
            </React.Fragment>
          ))}
        </div>
        {line}

        <div className="flex py-2  justify-between">
          <div className="flex  flex-col">
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ fontSize: "1rem", bgcolor: "grey.400" }}
                  width={280}
                  height={30}
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="py-2 flex gap-3">
          <Skeleton
            variant="circular"
            animation="wave"
            width={50}
            height={50}
          />
          <Skeleton
            variant="text"
            animation="pulse"
            sx={{ fontSize: "1rem", bgcolor: "grey.400" }}
            width={130}
          />
        </div>
      </div>
    </>
  );
};

export default OrdersSkeleton;
