import React, { useEffect, useState } from "react";
import { CartItem } from "./CartItem/CartItem";
import { useDispatch, useSelector } from "react-redux";
import { SideCart } from "./SideCart";
import { ShoppingBagOutlined } from "@mui/icons-material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { UpdatedNotification } from "./UpdatedNotification";
import * as CartActions from "../../store/cart";
import * as WishlistActions from "../../store/wishlist";
import useCurrencyFormatter from "../utilities/currency/useCurrencyFormatter";
import Breadcrumb from "../../BreadCrumb";

// Functional component definition
const Cart = () => {
  // Retrieve data from Redux store using useSelector
  const cart = useSelector((state) => state.cart.items);
  const wishlist = useSelector((state) => state.wishlist);
  const subtotal = useSelector((state) => parseFloat(state.cart.subtotal));
  const user = useSelector((state) => state.userAuth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formatAmount = useCurrencyFormatter();
  // State variables for notification
  const [notification, setNotification] = useState(false);
  const [message, setMessage] = useState("");

  // Function to handle item removal from cart
  const handleRemoveItem = (text) => {
    // Perform removal logic here

    // Set notification message and show notification
    setNotification(true);
    setMessage(text);

    // Set a timeout to hide the notification after a certain duration
    setTimeout(() => {
      setNotification(false);
      setMessage("");
    }, 1700);
  };

  // Function to move all items from cart to wishlist
  const moveAllToWishlist = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        console.error(
          "You need to be registered to add the product to the wishlist",
        );
        return;
      }

      // Iterate over each item in the cart and add it to the wishlist
      cart.forEach((item) => {
        const product = item;

        // Add the product to the wishlist
        if (dispatch(WishlistActions.addProductToWishlist(product))) {
          // Reset the cart only if the product was successfully added to the wishlist
          dispatch(CartActions.resetCart());
        } else {
          console.error("Failed to add product to the wishlist:", product);
          // Handle the case where the product couldn't be added to the wishlist
        }
      });
    } catch (error) {
      console.error(
        "Error while transferring items from the cart to the wishlist:",
        error,
      );
    }
  };

  // Handle the click event on the "Move to Wishlist" button
  const handleMoveToWishlist = (event, product) => {
    event.preventDefault();

    // Add the product to the wishlist and remove it from the cart
    dispatch(
      WishlistActions.addProductToWishlist({
        product: product.product,
        quantity: 1,
      }),
    );
    dispatch(CartActions.deleteFromCart({ id: product.product.id }));

    // Show notification indicating successful move to wishlist
    handleRemoveItem("Moved to Wishlist.");
  };

  // Effect hook to automatically move items to wishlist after a certain duration
  useEffect(() => {
    // Set a timeout to trigger the move to wishlist after an hour
    const timeoutId = setTimeout(() => {
      moveAllToWishlist();
    }, 3600000);

    // Cleanup function to clear the timeout
    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  return (
    <AnimatePresence>
      {cart.length > 0 || notification ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key="cart-full"
          transition={{ duration: 0.3 }}
          className=" relative my-8 h-full max-w-full justify-center mx-3 gap-4 flex flex-col items-center lg:items-start lg:flex-row  "
        >
          <AnimatePresence>
            <div className="flex flex-col w-full xs:max-w-[29.75rem]   items-center gap-3 my-2 mx-3 lg:mb-10">
              <div className=" w-full max-w-[20.75rem] xs:max-w-[31.125rem] px-5 flex flex-col md:justify-between bg-slate-200 py-2 gap-1 rounded-lg">
                <h1 className="text-xl font-bold text-primary-black">Cart</h1>
                <p className="text-xs leading-relaxed">
                  The items remain in the cart for 60 minutes, then they are
                  moved to{" "}
                  <Link
                    className="underline underline-offset-2"
                    to="/dashboard/wishlist"
                  >
                    Saved Products
                  </Link>
                  .
                </p>
              </div>
              <UpdatedNotification action={notification} message={message} />
              {cart.map((item) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  key={item.product.id}
                  className="w-full h-full"
                >
                  <CartItem
                    removeFromCart={true}
                    key={item.product.id}
                    itemId={item.product.id}
                    image={item.product.image[0]}
                    category={item.product.category.join(", ")}
                    title={item.product.title}
                    price={parseFloat(item.product.price).toFixed(2)}
                    grams={500}
                    quantity={item.quantity}
                    link={`/products/${item.product.id}`}
                    product={item.product}
                    onRemove={() =>
                      handleRemoveItem("Item successfully removed.")
                    }
                    handleMoveToWishlist={(e) => handleMoveToWishlist(e, item)}
                  />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          <div
            className={`h-full xs:max-w-[28.125rem] mt-2 mb-7 lg:sticky lg:top-0`}
          >
            <SideCart
              subtotal={formatAmount(subtotal)}
              shipCost={subtotal >= 50 ? "Gratis" : formatAmount(5)}
            />
          </div>
        </motion.div>
      ) : (
        !notification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="cart-empty"
            transition={{ duration: 0.3 }}
            className=" relative min-h-[55vh] flex justify-center items-center 2xl:h-screen mt-10 mb-5  max-w-full gap-4"
          >
            <div className="flex min-h-[18.75rem] max-h-96 overflow-hidden max-w-md 2xl:max-w-full m-3 p-3 rounded-md bg-slate-200">
              <div className="flex flex-col flex-1 p-3 justify-center items-center gap-3">
                <ShoppingBagOutlined fontSize="large" />
                <span className="text-lg font-semibold tracking-widest  ">
                  Your cart is empty.
                </span>
                <p className="text-center text-sm leading-relaxed">
                  The items remain in the cart for 60 minutes, then they are
                  moved to Saved Products.
                </p>
                {user ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/dashboard/wishlist")}
                      role="button"
                      className="max-w-sm uppercase rounded-md bg-primary-btn px-4 py-2 font-semibold hover:bg-primary-hover"
                      aria-label="View Saved Products"
                    >
                      View Saved Products
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/products/category/all")}
                      role="button"
                      className="text-xs underline underline-offset-1"
                      aria-label="Continue Shopping"
                    >
                      Continue Shopping
                    </motion.button>
                  </>
                ) : (
                  <>
                    <p className="text-center text-sm leading-relaxed">
                      Sign in to view your cart and start shopping!
                    </p>
                    <NavLink
                      to="/login"
                      className="w-1/2 rounded-md bg-primary-btn px-4 py-2 text-center font-semibold hover:bg-primary-hover"
                      aria-label="Login"
                    >
                      Login
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
};

export default Cart;
