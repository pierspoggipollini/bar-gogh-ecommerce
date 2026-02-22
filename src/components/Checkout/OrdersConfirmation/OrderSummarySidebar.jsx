import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  containerVariants,
  itemVariantsFooter,
} from "../../utilities/variants";
import { capitalizeFirstLetter } from "../../utilities/capitalizeFirstLetter";
import "swiper/swiper-bundle.css";
import "swiper/css/pagination";
import "../swiperStyle.css";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ItemContainer } from "../ItemContainer";
import useCurrencyFormatter from "../../utilities/currency/useCurrencyFormatter";

const OrderSummarySidebar = ({
  count,
  subtotal,
  discountAmount,
  ship,
  pickupInStore,
  totalOrder,
  orderData,
  paymentMethod,
  title,
}) => {
  // State to manage the visibility of the side checkout
  const [isBigScreen, setIsBigScreen] = useState(
    window.matchMedia("(min-width: 1024px)").matches,
  );
  const [active, setActive] = useState(isBigScreen);
  const formatAmount = useCurrencyFormatter();
  // useEffect to set up an event listener for screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsBigScreen(window.matchMedia("(min-width: 1024px)").matches);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update the active state based on isBigScreen
  useEffect(() => {
    setActive(isBigScreen);
  }, [isBigScreen]);

  const line = (
    <div className="flex my-2 after:w-full after:flex-1 after:flex-shrink-0 after:border-b-slate-400 after:border after:content-['']"></div>
  );

  return (
    <>
      {/* Aside container for side checkout */}
      <aside
        className="flex flex-col rounded-lg w-full md:w-[32rem] lg:w-[24rem]  bg-gradient-to-r from-gray-100 to-gray-300"
        role="complementary"
        aria-label="Shopping Cart"
      >
        {/* Mobile header for order summary */}
        <div className="flex z-0 lg:hidden text-sm rounded-lg shadow-xl items-center justify-between p-4 w-full h-14 bg-gradient-to-r from-gray-100 to-gray-300 top-0 sticky">
          <span>{title}</span>
          <span>{`${count} items`}</span>

          {/* Button to toggle order summary  visibility */}
          <motion.div animate={active ? "open" : "closed"} initial="closed">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setActive(!active);
              }}
              className="tabular-nums flex items-center"
              aria-label="Toggle Cart"
            >
              {subtotal}
              <motion.div
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 },
                }}
                transition={{ duration: 0.2 }}
              >
                <KeyboardArrowDown fontSize="small" />
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Desktop header for order summary */}
        <div className="hidden z-10 lg:flex rounded-t-lg shadow-xl items-center justify-between p-4 w-full h-14 bg-gradient-to-r from-gray-100 to-gray-300 top-0 sticky">
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        {/* Cart content with animation */}
        <AnimatePresence>
          {active && (
            <>
              {/* Mobile order summary content */}
              <motion.div
                initial="closed"
                animate={active ? "open" : "closed"}
                exit="closed"
                variants={containerVariants}
                className="lg:hidden h-full p-4 md:px-10 md:py-4 lg:p-4 z-0 w-full grid bg-gradient-to-r from-gray-100 to-gray-300"
              >
                {/* Swiper component for mobile order summary */}
                <Swiper
                  modules={[Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  slidesPerGroup={1}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      slidesPerGroup: 2,
                      spaceBetween: 10,
                    },
                    1024: {
                      slidesPerView: 1,
                      slidesPerGroup: 2,
                      spaceBetween: 10,
                    },
                  }}
                  aria-label="Cart Items"
                >
                  {/* Map through order summary items and display them in SwiperSlides */}
                  {orderData &&
                    orderData.length > 0 &&
                    orderData.map((item) => (
                      <SwiperSlide key={item.product.id}>
                        <ItemContainer
                          key={item.product.id}
                          category={
                            item.product.category.length > 1
                              ? capitalizeFirstLetter(
                                  item.product.category[0],
                                ) +
                                ", " +
                                item.product.category.slice(1)
                              : capitalizeFirstLetter(item.product.category[0])
                          }
                          image={item.product.image[0]}
                          price={parseFloat(
                            item.product.price * item.quantity,
                          ).toFixed(2)}
                          title={item.product.title}
                          quantity={item.quantity}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </motion.div>

              {/* Desktop order summary content */}
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={containerVariants}
                className="hidden p-4 z-0 w-full lg:grid gap-3 bg-gradient-to-r from-gray-100 to-gray-300"
              >
                {/* Map through order summary items and display them */}
                {orderData &&
                  orderData.length > 0 &&
                  orderData.map((item) => (
                    <React.Fragment key={item.product.id}>
                      <ItemContainer
                        key={item.product.id}
                        category={
                          item.product.category.length > 1
                            ? capitalizeFirstLetter(item.product.category[0]) +
                              ", " +
                              item.product.category.slice(1)
                            : capitalizeFirstLetter(item.product.category[0])
                        }
                        image={item.product.image[0]}
                        price={parseFloat(
                          item.product.price * item.quantity,
                        ).toFixed(2)}
                        title={item.product.title}
                        quantity={item.quantity}
                      />
                    </React.Fragment>
                  ))}
              </motion.div>

              {/* Cart summary */}
              <motion.div
                className="flex p-4 lg:mt-8 flex-col gap-1"
                aria-label="Order Summary"
              >
                {/* Items count and subtotal */}
                <motion.div
                  variants={itemVariantsFooter}
                  className="flex h-full justify-between items-center text-sm"
                  aria-label={`Items (${count})`}
                >
                  <motion.span>{`Items (${count})`}</motion.span>
                  <motion.span>{subtotal}</motion.span>
                </motion.div>
                {/* Coupon discount */}
                {discountAmount !== 0 && (
                  <motion.div
                    variants={itemVariantsFooter}
                    className="flex h-full items-center justify-between text-green-800 text-sm"
                    aria-label="Coupon Discount"
                  >
                    <motion.span className="">Coupon</motion.span>
                    <motion.span className="tabular-nums">
                      {`-${formatAmount(discountAmount)}`}
                    </motion.span>
                  </motion.div>
                )}
                {/* Shipping cost */}
                {pickupInStore === false ? (
                  <motion.div
                    variants={itemVariantsFooter}
                    className="flex h-full items-center justify-between text-sm"
                    aria-label="Shipping Cost"
                  >
                    <motion.span>Ship</motion.span>
                    <motion.span>
                      {ship == 0 ? "Gratis" : formatAmount(ship)}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={itemVariantsFooter}
                    className="flex h-full items-center justify-between text-sm"
                    aria-label="In-store Pickup"
                  >
                    <motion.span>In-store pickup</motion.span>
                    <motion.span>Gratis</motion.span>
                  </motion.div>
                )}
                {line}
                {/* Total order cost */}
                <motion.div
                  variants={itemVariantsFooter}
                  className="flex justify-between items-center text-sm"
                  aria-label="Total Order Cost"
                >
                  <b>Total orders</b>
                  <b>{totalOrder}</b>
                </motion.div>
                {paymentMethod && (
                  <>
                    {line}

                    <motion.div
                      variants={itemVariantsFooter}
                      className="flex justify-between items-center text-sm"
                      aria-label="Total Order Cost"
                    >
                      <p>Paid via</p>
                      {paymentMethod}
                    </motion.div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
};

export default OrderSummarySidebar;
