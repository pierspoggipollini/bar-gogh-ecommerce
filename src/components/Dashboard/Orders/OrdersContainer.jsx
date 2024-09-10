import React from "react";
import { NavigateButton } from "../NavigateButton";

export const OrdersContainer = ({
  orderStatus,
  orderId,
  shippingDate,
  orderDate,
  shipped,
}) => {
  const line = (
    <div className="flex pb-2 after:w-32 after:flex-1 after:flex-shrink-0 after:border-b-slate-400 after:border after:border-slate-100 after:content-['']"></div>
  );
  return (
    <>
      <div className="bg-slate-100 p-4 rounded-lg">
        <div className="flex max-w-md h-auto gap-1 py-2 flex-col">
          <p className="text-slate-600 text-xs font-semibold uppercase">
            Status Order:
          </p>
          <b className="uppercase text-base text-slate-800 font-bold">
            {orderStatus}
          </b>
          {shipped && (
            <p className="text-xs text-green-700">
              Delivered on {shippingDate}
            </p>
          )}
        </div>
        {line}

        <div className="flex py-2  justify-between">
          <div className="flex gap-2  flex-col">
            <p className="text-sm uppercase font-semibold line-clamp-2 text-slate-600">
              Order n. : <span className="text-slate-800">{orderId}</span>
            </p>
            <p className="text-sm uppercase font-semibold line-clamp-2 text-slate-600">
              Order Date : <span className="text-slate-800">{orderDate}</span>
            </p>
            <p className="font-semibold text-slate-600 text-sm uppercase">
              Shipped Date:{" "}
              <span className="text-slate-800 normal-case ">
                {shippingDate ? shippingDate : "Not yet shipped."}
              </span>
            </p>
          </div>
        </div>

        <div className="py-2">
          <NavigateButton to={orderId} title="View Order" />
        </div>
      </div>
    </>
  );
};
