import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { DashHeader } from "../DashHeader";
import { Inventory2Outlined, PersonOutline } from "@mui/icons-material";
import { db } from "../../../firebaseMethod";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { OrdersContainer } from "./OrdersContainer";
import { useDispatch, useSelector } from "react-redux";
import { compareDates } from "./compareDates";
import OrdersSkeleton from "./OrdersSkeleton";
import { useOrders } from "../../../ReactQuery/useOrders";

export const MyOrders = ({}) => {
  const uid = useSelector((state) => state.userAuth.user?.uid);
  const [latestOrderStatus, setLatestOrderStatus] = useState({});
  const [shippedDate, setShippedDate] = useState(null);

  const { isLoading, error, data: sortedOrderData, refetch } = useOrders();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (uid) {
          const userDocRef = doc(db, "users", uid);
          const ordersCollectionRef = collection(userDocRef, "orders");

          const unsub = onSnapshot(ordersCollectionRef, () => {
            refetch();
          });

          return () => {
            unsub();
          };
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle the error, e.g., set an error state
      }
    };

    fetchOrders();
  }, [uid]);

  const NoOrders = () => {
    return (
      <div className="flex h-64 max-w-full items-center justify-center  rounded-lg bg-slate-100  p-4">
        <div className=" flex w-auto flex-col items-center gap-2 text-center ">
          <h1 className=" text-base lg:text-lg font-semibold">
            Currently, you have no orders.
          </h1>
          <NavLink
            className=" my-3 uppercase flex h-12 w-64 items-center justify-center rounded-md bg-primary-btn  p-2 font-semibold hover:bg-primary-hover"
            to="/products/category/all"
          >
            Shop Now
          </NavLink>
        </div>
      </div>
    );
  };

  const orderCreatedAt = sortedOrderData?.map((order) => {
    return order.createdAt;
  });

  useEffect(() => {
    if (!isLoading && sortedOrderData) {
      const statusHistory = sortedOrderData.map((order) => order.statusHistory);

      if (statusHistory) {
        const latestStatuses = statusHistory.map((orderStatuses) => {
          orderStatuses.sort((a, b) => compareDates(a.date, b.date));
          return orderStatuses[0];
        });

        setLatestOrderStatus(latestStatuses);
      } else {
        setLatestOrderStatus({});
      }
    }
  }, [isLoading, sortedOrderData]);

  /* useEffect(() => {
  // Flatten the nested arrays using flat() to handle possible null or undefined values
  const allStatusHistory = statusHistory?.flat();

  // Verifica se statusHistory non è null o undefined
  if (allStatusHistory) {
    // Trova l'ultimo stato utilizzando la funzione compareDates
    const latestStatuses = allStatusHistory.map((orderStatuses) => {
      // Ordina gli stati di un ordine in base alla data
      const orderedStatuses = orderStatuses.sort((a, b) =>
        compareDates(a.date, b.date),
      );

      // Prendi l'ultimo stato dall'array ordinato
      const latestStatus = orderedStatuses[orderedStatuses.length - 1];
      return latestStatus;
    });

    // Qui puoi fare ulteriori operazioni con l'array latestStatuses, se necessario
    console.log(latestStatuses);

    // Ad esempio, puoi impostare uno stato nel tuo componente React
    setLatestOrderStatus(latestStatuses);
  } else {
    // If allStatusHistory is null or undefined, set an empty object as the latest order status
    setLatestOrderStatus({});
  }
}, [statusHistory]); */

  useEffect(() => {
    if (!isLoading && sortedOrderData) {
      const statusHistory = sortedOrderData.map((order) => order.statusHistory);

      if (statusHistory) {
        const newShippedDates = statusHistory.map((orderStatuses) =>
          orderStatuses
            .filter((status) => status.status === "shipped")
            .map((shippedStatus) => shippedStatus.date),
        );

        setShippedDate(newShippedDates);
      } else {
        setShippedDate([]);
      }
    }
  }, [isLoading, sortedOrderData]);

  const orders = sortedOrderData?.map((order, index) => (
    <React.Fragment key={index}>
      <OrdersContainer
        orderId={order.orderId}
        orderStatus={latestOrderStatus[index]?.status || "Not available"}
        orderDate={orderCreatedAt[index]}
        shippingDate={
          shippedDate && shippedDate[index] && shippedDate[index]?.[0]
            ? shippedDate[index][0]
            : "Not yet shipped"
        }
      />
    </React.Fragment>
  ));

  return (
    <>
      <DashHeader
        /*  backPage="/dashboard" */
        backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
        title="My Orders"
        icon={<Inventory2Outlined fontSize="large" />}
      />
      {isLoading && <OrdersSkeleton />}
      {!isLoading && error && <NoOrders />}
      {!isLoading && !error && sortedOrderData.length === 0 && <NoOrders />}
      {!isLoading && !error && sortedOrderData.length > 0 && orders}
    </>
  );
};
