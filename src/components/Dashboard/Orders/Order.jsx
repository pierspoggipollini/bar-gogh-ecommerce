import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { db } from "../../../firebaseMethod";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import { LayoutDashboard } from "../../Layout/LayoutDashboard";
import { DashHeader } from "../DashHeader";
import {
  DateRangeOutlined,
  Inventory2Outlined,
  PersonOutline,
} from "@mui/icons-material";
import { ItemContainer } from "../../Checkout/ItemContainer";
import { formatTimestamp } from "../../utilities/formatTimestamp";
import { NavigateButton } from "../NavigateButton";
import { Skeleton } from "@mui/material";
import { twMerge } from "tailwind-merge";
import { cardImages } from "../Payment/CardImages";
import { compareDates } from "./compareDates";
import useCurrencyFormatter from "../../utilities/currency/useCurrencyFormatter";
import axiosInstance from "../../../config/axiosInstance";

const Order = () => {
  const { id } = useParams(); // Extracts the `id` parameter from the URL

  // State variables to hold order data, payment method, latest order status, and error message
  const [orderData, setOrderData] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [latestOrderStatus, setLatestOrderStatus] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  // Custom hook to format currency amounts
  const formatAmount = useCurrencyFormatter();

  // Retrieves the UID (user ID) from Redux state
  const uid = useSelector((state) => state.userAuth.user.uid);

  // Retrieves the user authentication state from Redux
  const userAuthState = useSelector((state) => state.userAuth);

  // Retrieves the Stripe customer ID from the user authentication state, or defaults to null
  const stripeCustomerId = userAuthState.user?.stripeCustomerId || null;

  // State variable to manage loading state
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch order data from Firestore
  const fetchOrderData = async () => {
    setIsLoading(true); // Sets loading state to true

    try {
      // Constructs Firestore document references for the user and the order
      const userDocRef = doc(db, "users", uid);
      const orderDocRef = doc(userDocRef, "orders", id);

      // Retrieves the order document snapshot from Firestore
      const orderDataSnapshot = await getDoc(orderDocRef);

      if (orderDataSnapshot.exists()) {
        // If the order document exists, retrieve and set the order data
        const orderData = orderDataSnapshot.data();
        setOrderData(orderData);
      } else {
        // If the order document does not exist, throw an error
        throw new Error("Oops! It seems that the order doesn't exist.");
      }
    } catch (error) {
      console.error(error); // Logs the error to the console
      setErrorMessage("Oops! It seems that the order doesn't exist."); // Sets error message state
    } finally {
      setIsLoading(false); // Sets loading state to false after completing the operation
    }
  };

  // Destructuring orderData object with default empty object to prevent errors if orderData is null or undefined
  const {
    orderId,
    orderFullName,
    billingDetails,
    shippingDetails,
    shipCost,
    pickupInStore,
    shippingOption,
    subtotal,
    items,
    paymentIntentId,
    paymentMethodId,
    amount,
    discountAmount,
    currency,
    createdAt,
    status,
    statusHistory,
  } = orderData || {};

  // Function to fetch payment method details from Stripe API
  const fetchPaymentMethod = async () => {
    setIsLoading(true); // Sets loading state to true

    // Checks if either stripeCustomerId or paymentMethodId is not available, returns early if true
    if (!stripeCustomerId || !paymentMethodId) {
      return;
    }

    try {
      // Makes an HTTP GET request to fetch payment method details from Stripe
      const response = await axiosInstance.get(
        `customers/${stripeCustomerId}/payment_methods/${paymentMethodId}`,
      );

      // Sets paymentMethod state with data retrieved from Stripe response
      setPaymentMethod(response.data.card);
    } catch (error) {
      console.error(error); // Logs error to console if HTTP request fails
      setErrorMessage("Payment method not found."); // Sets error message state if payment method retrieval fails
    } finally {
      setIsLoading(false); // Sets loading state to false after HTTP request completes (success or failure)
    }
  };

  // Parses subtotal string value to float number
  const subtotalOrder = parseFloat(subtotal);

  // Effect hook to fetch order and payment method data on component mount or dependency change
  useEffect(() => {
    // Async function to fetch order data and payment method
    const fetchData = async () => {
      try {
        await fetchOrderData(); // Calls fetchOrderData function to fetch order details

        // If fetchOrderData succeeds, call fetchPaymentMethod to fetch payment method details
        fetchPaymentMethod();
        setErrorMessage(""); // Clear any existing error message
      } catch (error) {
        console.error(error); // Logs error to console if fetchOrderData or fetchPaymentMethod fails
        setErrorMessage(error.message); // Sets error message state with the error message from the catch block
      }
    };

    fetchData(); // Calls fetchData function on component mount or when dependencies (id, stripeCustomerId, paymentMethodId) change
  }, [id, stripeCustomerId, paymentMethodId]); // Dependency array for useEffect to trigger fetch on changes to these values

  /* const createdAtInSeconds = createdAt.seconds;
const createdAtInMilliseconds = createdAtInSeconds * 1000; // Converti i secondi in millisecondi
const createdAtDate = new Date(createdAtInMilliseconds);

 */

  const line = (
    <div className="flex my-2 after:w-32 after:flex-1 after:flex-shrink-0 after:border-b-slate-200 after:border after:border-slate-100 after:content-['']"></div>
  );

  useEffect(() => {
    // Clone the statusHistory array using optional chaining to handle possible null or undefined values
    const orderedStatusHistory = statusHistory?.slice();

    // Check if orderedStatusHistory is not null or undefined
    if (orderedStatusHistory) {
      // Sort the cloned array based on date using the compareDates function
      orderedStatusHistory.sort((a, b) => compareDates(a.date, b.date));

      // Get the latest status (first element after sorting)
      const latestStatus = orderedStatusHistory[0];

      // Set the latest order status in the state
      setLatestOrderStatus(latestStatus);
    } else {
      // If statusHistory is null or undefined, set an empty object as the latest order status
      setLatestOrderStatus({});
    }
  }, [statusHistory]);
  // Run only when statusHistory changes

  // Calculate the number of items in the order
  const numbersOfItems = orderData.items?.length;

  // Formatting the subtotal and shipping cost based on currency
  let subtotalInCurrency;
  let shipInCurrency;

  if (currency === "eur") {
    subtotalInCurrency = formatAmount(subtotalOrder); // Format subtotal for EUR currency
    shipInCurrency = shipCost > 0 && formatAmount(shipCost); // Format shipping cost for EUR currency if applicable
  } else {
    // Handle formatting for other currencies if needed
    subtotalInCurrency = subtotalOrder.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    shipInCurrency = shipCost?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  let expectedShipDate;
  let typeShip;

  // Determine shipping details based on selected shipping option
  if (shippingOption && shippingOption["standard"]) {
    expectedShipDate = shippingOption["standard"].expectedShipDate;
    typeShip = shippingOption["standard"].type;
  } else if (shippingOption && shippingOption["express"]) {
    expectedShipDate = shippingOption["express"].expectedShipDate;
    typeShip = shippingOption["express"].type;
  } else if (shippingOption && shippingOption["pickupInStore"]) {
    typeShip = shippingOption["pickupInStore"].type;
  }

  /*   // Ordina l'array statusHistory per data in modo decrescente
  const sortedStatusHistory = statusHistory
    ? statusHistory
        .slice()
        .sort((a, b) => new Date(b.date) - formatTimestamp(a.date))
    : []; */

  // Filter and map statuses based on their status type
  const pending = statusHistory
    ?.filter((status) => status.status === "pending") // Filter statuses that are "pending"
    .map((status) => ({
      status: status.status, // Include the status type
    }));

  const shipped = statusHistory
    ?.filter((status) => status.status === "shipped") // Filter statuses that are "shipped"
    .map((status) => ({
      status: status.status, // Include the status type
      date: status.date, // Include the date of shipment
      method: typeShip, // Include the shipping method (typeShip)
      // Create a NavigateButton component for tracking the shipment
      trackingNumber: (
        <NavigateButton
          title="Tracking"
          to={status.trackingNumber} // Provide the tracking number as the destination
          openInNewTab={true} // Open the tracking link in a new tab
        />
      ),
      via: status.via, // Include the shipping carrier (via)
    }));

  const delivered = statusHistory
    ?.filter((status) => status.status === "delivered") // Filter statuses that are "delivered"
    .map((status) => ({
      status: status.status, // Include the status type
      date: status.date, // Include the date of delivery
    }));

  const returned = statusHistory
    ?.filter((status) => status.status === "returned") // Filter statuses that are "returned"
    .map((status) => ({
      status: status.status, // Include the status type
      date: formatTimestamp(status.date.seconds), // Format and include the return date
    }));

  const cancelled = statusHistory
    ?.filter((status) => status.status === "cancelled") // Filter statuses that are "cancelled"
    .map((status) => ({
      status: status.status, // Include the status type
      date: formatTimestamp(status.date.seconds), // Format and include the cancellation date
    }));

  // Header for pending status
  const HeaderPending = [
    {
      category: "Status", // Category title for status
      details: pending?.map((status) => status.status), // Array of pending status details
    },
  ];

  // Header for shipped status
  const HeaderShipped = [
    {
      category: "Status", // Category title for status
      details: shipped?.map((status) => status.status), // Array of shipped status details
    },
    {
      category: "Ship Date", // Category title for ship date
      details: shipped?.map((status) => status.date), // Array of shipped dates
    },
  ];

  // Header for delivered status
  const HeaderDelivered = [
    {
      category: "Status", // Category title for status
      details: delivered?.map((status) => status.status), // Array of delivered status details
    },
    {
      category: "Delivered Date", // Category title for delivered date
      details: delivered?.map((status) => status.date), // Array of delivered dates
    },
  ];

  // Header for returned status
  const HeaderReturned = [
    {
      category: "Status", // Category title for status
      details: returned?.map((status) => status.status), // Array of returned status details
    },
    {
      category: "Returned Date", // Category title for returned date
      details: returned?.map((status) => status.date), // Array of returned dates
    },
  ];

  // Header for cancelled status
  const HeaderCancelled = [
    {
      category: "Status", // Category title for status
      details: cancelled?.map((status) => status.status), // Array of cancelled status details
    },
    {
      category: "Cancelled Date", // Category title for cancelled date
      details: cancelled?.map((status) => status.date), // Array of cancelled dates
    },
  ];

  // Order details array
  const OrderDetailsArray = [
    {
      icon: <Inventory2Outlined fontSize="small" />, // Icon for order number
      category: "Order Number", // Category title for order number
      detail: orderId, // Order number detail
    },
    {
      icon: <DateRangeOutlined fontSize="small" />, // Icon for order date
      category: "Order Date", // Category title for order date
      detail: createdAt, // Order date detail
    },
  ];

  // Shipping options array
  const ShippingOptionsArray = [
    {
      category: "Shipping Method", // Category title for shipping method
      detail: typeShip, // Shipping method detail
    },
    {
      category: "Shipping Date", // Category title for shipping date
      detail: shipped?.map((status) => status.date), // Array of shipping dates
    },
    ...(pickupInStore === true
      ? [] // Exclude shipped via if pickup in store is true
      : [
          {
            category: "Shipped via", // Category title for shipped via
            detail: shipped?.map((status) => status.via), // Array of shipped via details
          },
        ]),
  ];

  // Total order array
  const TotalOrderArray = [
    {
      category: "Subtotal", // Category title for subtotal
      detail: subtotalInCurrency, // Subtotal detail in currency format
    },
    // Include "Discount" category only if discountAmount is not 0
    ...(discountAmount !== 0
      ? [
          {
            category: "Discount", // Category title for discount
            detail: discountAmount, // Discount amount detail
          },
        ]
      : []),
    {
      category: "Shipping", // Category title for shipping cost
      detail: shipInCurrency ? shipInCurrency : shipCost, // Shipping cost detail in currency format
    },
  ];

  // Component for rendering a list item with category and details
  const ListContainer = ({ category, details, typographic }) => {
    return (
      <>
        <div className="flex items-center gap-2">
          <h2
            className={twMerge(
              `text-slate-700  uppercase tracking-wide font-semibold text-sm`,
              typographic,
            )}
          >
            {`${category}:`}
          </h2>
          <span
            className={twMerge(
              `text-sm font-semibold tracking-wide uppercase`,
              typographic,
            )}
          >
            {details}
          </span>
        </div>
      </>
    );
  };

  // Component for rendering total order details with category and details
  const ListContainerTotalOrder = ({ category, details, typographic }) => {
    return (
      <>
        <div className="flex items-center justify-between">
          <h2
            className={twMerge(
              `text-slate-700  uppercase tracking-wide font-semibold text-sm`,
              typographic,
            )}
          >
            {`${category}:`}
          </h2>
          <span
            className={twMerge(`text-sm tracking-wide uppercase`, typographic)}
          >
            {details}
          </span>
        </div>
      </>
    );
  };

  // Component for rendering status-specific order details
  const statusOrderDetail = (
    <div className="mt-2 flex flex-col gap-2">
      {latestOrderStatus.status === "pending" && (
        <>
          {HeaderPending.map((status) => (
            <ListContainer
              key={status.category}
              category={status.category}
              details={status.details}
            />
          ))}
          <span className="text-sm">
            Your order will be processed within 3 days.
          </span>
        </>
      )}
      {latestOrderStatus.status === "delivered" && (
        <>
          <h2 className="text-slate-700 uppercase tracking-wide font-semibold text-sm">
            Delivered Status:
          </h2>
          {HeaderDelivered.map((status) => (
            <ListContainer
              key={status.category}
              category={status.category}
              details={status.details}
            />
          ))}
        </>
      )}
      {latestOrderStatus.status === "shipped" && (
        <>
          <h2 className="text-slate-700 uppercase tracking-wide font-semibold text-sm">
            Shipped Status:
          </h2>
          {HeaderShipped.map((status) => (
            <ListContainer
              key={status.category}
              category={status.category}
              details={status.details}
            />
          ))}
        </>
      )}
      {latestOrderStatus.status === "returned" && (
        <>
          <h2 className="text-slate-700 uppercase tracking-wide font-semibold text-sm">
            Returned Status:
          </h2>
          {HeaderReturned.map((status) => (
            <ListContainer
              key={status.category}
              category={status.category}
              details={status.details}
            />
          ))}
        </>
      )}
      {latestOrderStatus.status === "cancelled" && (
        <>
          <h2 className="text-slate-700 uppercase tracking-wide font-semibold text-sm">
            Cancelled Status:
          </h2>
          {HeaderCancelled.map((status) => (
            <ListContainer
              key={status.category}
              category={status.category}
              details={status.details}
            />
          ))}
        </>
      )}
    </div>
  );

  // Component for rendering shipping options list
  const ShippingOptionsList = (
    <div className="my-4 flex flex-col gap-1">
      {ShippingOptionsArray.map((option, index) => (
        <ListContainer
          key={index}
          category={option.category}
          details={option.detail}
        />
      ))}
      <div className="mt-4">
        {shipped?.map((status) => status.trackingNumber)}
        {/* Uncomment below if NavigateButton component with tracking feature is used */}
        {/* <NavigateButton to={null} title="Tracking" /> */}
      </div>
    </div>
  );

  // Component for wrapping details with a titled container
  const DetailsContainer = ({ title, children }) => {
    return (
      <div className="bg-slate-100 my-4 h-auto px-5 py-4 rounded-lg flex flex-col">
        <h3 className="text-sm leading-7 font-semibold uppercase">{title}</h3>
        <div>{children}</div>
      </div>
    );
  };

  // Component for rendering order details header with icon, category, and detail
  const HeaderOrderDetails = ({ icon, category, detail }) => {
    return (
      <div className="flex max-w-sm gap-1 flex-wrap justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-slate-700 text-sm font-semibold uppercase">
            {category}:
          </span>
        </div>
        <span className="text-sm px-7 xs:px-0">{detail}</span>
      </div>
    );
  };

  // Component for displaying order details
  const orderDetails = (
    <div className="max-h-32 h-32 my-2 w-full flex flex-col justify-center gap-3 bg-slate-100 rounded-lg px-5  ">
      {OrderDetailsArray.map((order) => (
        <HeaderOrderDetails
          key={`order_details_${order.category}`}
          category={order.category}
          icon={order.icon}
          detail={order.detail}
        />
      ))}
    </div>
  );

  // Component for displaying item order details
  const itemDetails = (
    <div className="h-auto my-2 py-4  flex flex-col justify-center gap-3 bg-slate-100 px-5 rounded-lg  ">
      {statusOrderDetail}
      {line}
      <div className="my-1 flex flex-col gap-5 pb-4">
        <h3 className="font-semibold text-base">
          Ordered Items ({items?.length})
        </h3>
        {items?.map((item) => (
          <React.Fragment key={item.product.id}>
            <ItemContainer
              title={item.product.title}
              image={item.product.image[0]}
              price={item.product.price}
              category={item.product.category.join(", ")}
              quantity={item.quantity}
            />
          </React.Fragment>
        ))}
      </div>
      {shipped && shipped.length > 0 && ShippingOptionsList}
    </div>
  );

  const loading = false;

  // Component for displaying shipped address
  const shippedAdress = (
    <DetailsContainer title="Ship Address">
      {loading ? (
        <div className="relative flex  justify-center flex-col w-full rounded-lg bg-slate-100 ">
          <div className="flex  w-2/3 sm:text-sm lg:text-base flex-col flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width={270}
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex h-auto mb-2 last:mb-0 flex-col w-full rounded-lg bg-slate-100 ">
          {shippingDetails && (
            <ul className="flex max-w-xs text-sm flex-col flex-wrap gap-1">
              <div className="flex gap-1">
                <li>{shippingDetails.firstName}</li>
                <li>{shippingDetails.lastName}</li>
              </div>
              {shippingDetails.newAddress.address.length > 0 ? (
                <li>{shippingDetails.fullAddress}</li>
              ) : (
                <li className="w-full">{shippingDetails.location}</li>
              )}
              <li>{shippingDetails.phone}</li>
            </ul>
          )}
          {line}
          <div className="min-h-12 my-3">
            <NavigateButton title="Return Info" to="/return" />
          </div>
        </div>
      )}
    </DetailsContainer>
  );

  // Component for displaying pick up options
  const pickUpOrder = (
    <DetailsContainer title="Ship Address">
      <div className="flex py-2">
        <span className="text-sm">Pick up in store</span>
      </div>
      {line}
      <div className="min-h-12 mt-3">
        <NavigateButton title="Return Information" to="/return" />
      </div>
    </DetailsContainer>
  );

  // Component for displaying total order
  const totalOrder = (
    <DetailsContainer title="Total Order">
      <div className="grid my-2 gap-3">
        {TotalOrderArray.map((order) => (
          <React.Fragment key={order.category}>
            <ListContainerTotalOrder
              category={order.category}
              details={order.detail}
            />
          </React.Fragment>
        ))}
      </div>
      {line}
      <div className="flex py-2 items-center justify-between">
        <span className="font-bold uppercase tracking-wide">Total:</span>
        <span className="font-semibold tracking-wide">{amount}</span>
      </div>
    </DetailsContainer>
  );

  // Component for displaying paid method
  const paidViaCard = (
    <div className="flex  gap-4 ">
      {paymentMethod.funding === "credit" ? (
        <div key={paymentMethod.brand} className="flex items-center gap-3">
          <img
            src={cardImages[paymentMethod.brand]}
            alt="credit card type"
            className="w-8 h-auto"
          />
          <span className="text-sm">{`${paymentMethod.brand.toUpperCase()} (${
            paymentMethod.last4
          })`}</span>
        </div>
      ) : (
        <div>
          <p>Not available</p>
        </div>
      )}
    </div>
  );

  // Component for displaying payment method details
  const detailsPayment = (
    <DetailsContainer title={"Payment Details"}>
      <ListContainer category="Paid via" details={paidViaCard} />
    </DetailsContainer>
  );

  return (
    <>
      <LayoutDashboard selectedItem="my-orders">
        <div className="w-full md:w-1/2 max-w-[32.5rem] lg:w-full">
          <div className="flex-col mt-8 md:mt-1 mx-3 md:mx-0 relative md:flex h-auto pb-2 max-h-28 overflow-auto rounded-lg bg-slate-100">
            <DashHeader
              backPage={true}
              backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
              title="Order Details"
            />
            <div className="px-5">
              <span className="text-sm">
                Thanks for your order! Check the details below.
              </span>
            </div>
          </div>
          <div className="mx-3 md:mx-0">
            {orderDetails}
            {!shippingOption?.pickupInStore ? shippedAdress : pickUpOrder}
            {itemDetails}
            {totalOrder}
            {detailsPayment}
          </div>
        </div>
        {/*  {orderDetails}
      {!shippingOption?.pickupInStore ? shippedAdress : pickUpOrder}
      {itemDetails}
      {totalOrder}
      {detailsPayment} */}
      </LayoutDashboard>
    </>
  );
};

export default Order;
