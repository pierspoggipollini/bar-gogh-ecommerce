import React, { useEffect, useState } from "react";
import * as CartActions from "../../../store/cart";
import { removeProductFromWishlist } from "../../../store/wishlist";
import "./CartButton.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import ShoppingCartProgress from "../../DetailsProducts/ShoppingCartProgress";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router-dom";
import { CloseOutlined } from "@mui/icons-material";
import {
  accountVariant,
  variantsRight,
} from "../../utilities/variants";

export function CartNotification({ title, addItem, onRemove, portalRef }) {
  const isBigScreen = window.matchMedia("(min-width: 768px)").matches;

  return createPortal(
    <AnimatePresence>
      {addItem && (
        <motion.div
          ref={portalRef}
          key={addItem}
          initial={isBigScreen ? "closed" : "closed"}
          transition="transition" // Set 'initial' based on variants
          animate={isBigScreen ? "open" : "open"} // Set 'animate' based on variants
          exit={isBigScreen ? "closed" : "closed"} // Set 'exit' based on variants
          variants={isBigScreen ? variantsRight : accountVariant}
          className="fixed top-20  z-10
            flex  min-h-48 h-full max-h-52 mx-3 w-auto max-w-sm md:max-w-md flex-col justify-center gap-5
             bg-primary/95  rounded-lg px-10 py-3 shadow-lg overflow-hidden
             
            lg:left-auto lg:top-20 lg:right-8 lg:flex lg:rounded-lg lg:border lg:border-slate-300 
            lg:before:absolute lg:before:-top-[7px] lg:before:right-[22px] lg:px-16
        
          "
          role="alert"
          aria-live="assertive"
        >
          <h2 className="text-center text-base font-semibold uppercase">
            {title}
          </h2>

          <div aria-hidden="true">
            <ShoppingCartProgress />
          </div>
          <div className="flex z-50 justify-center">
            <Link
              to="/cart"
              aria-label="View Cart"
              className="w-64 rounded-lg font-semibold text-center bg-primary-btn hover:bg-primary-hover p-2"
            >
              View Cart
            </Link>
          </div>
          <div
            onClick={onRemove}
            className="absolute cursor-pointer rounded-full hover:bg-slate-200 top-1 p-1 right-3"
          >
            <CloseOutlined />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("cart-notification-root"),
  );
}

export const CartButton = ({
  product,
  quantity,
  onButtonClicked, // Callback to send isAdded value to parent component
  detailsProductWidth,
  notAvailable,
}) => {
  // State to manage "adding in progress" and "added" states
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // State to manage the display of the cart notification
  const [cartMessage, setCartMessage] = useState(false);

  // Redux dispatch
  const dispatch = useDispatch();

  // Check if the product is added to the wishlist by checking the Redux state
  const isAddedToWishlist = useSelector((state) =>
    state.wishlist?.some(
      (wishlistItem) => wishlistItem.product.id === product.id,
    ),
  );

  // Handles the click on the "Add to Cart" button
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation(); // Stops event propagation to parents

    // Sets the "adding in progress" state
    setIsAdding(true);

    // Dispatches the action to add the product to the cart
    dispatch(
      CartActions.addItem({
        product: product,
        quantity: quantity,
      }),
    );

    // Send track to GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      product_name: product.title,
      product_id: product.id,
      price: product.price,
      quantity: quantity,
    });

    if (isAddedToWishlist) {
      // Dispatches the action to remove the product from wishlist
      dispatch(removeProductFromWishlist(product));
    } else {
      null;
    }

    // After a certain period of time, resets the "adding in progress" state and sets "added"
    const timeout = setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setCartMessage(true);

      // After an additional period of time, resets "added"
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
      setTimeout(() => {
        setCartMessage(false);
      }, 3500);
    }, 1000);

    // Clear the timeout to prevent memory leaks when the component unmounts
    return () => clearTimeout(timeout);
  };

  // Pass the value of cartMessage to the parent component via props
  useEffect(() => {
    onButtonClicked(cartMessage);
  }, [cartMessage]);

  return (
    <>
      {/* "Add to Cart" button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        title="Add to cart"
        aria-label={
          isAdded
            ? "Added to cart"
            : isAdding
              ? "Adding to cart..."
              : "Add to cart"
        } // ARIA label based on the state
        onClick={handleClick}
        disabled={isAdding}
        className={twMerge(
          `cart-button disabled:cursor-not-allowed ${isAdding || isAdded ? "sending" : ""}`,
          detailsProductWidth,
        )}
      >
        <span className="icon">
          {isAdded ? <CheckIcon /> : <ShoppingCartIcon />}
        </span>

        <span className="text">
          {isAdding ? "Adding..." : isAdded ? "Added" : "Add"}
        </span>
      </motion.button>

      {/* Cart notification */}
    </>
  );
};
