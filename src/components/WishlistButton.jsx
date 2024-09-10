import { Favorite, FavoriteBorder, FavoriteOutlined } from "@mui/icons-material";
import {
  Alert,
  Backdrop,
  createTheme,
  IconButton,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToWishlist,
  removeProductFromWishlist,
} from "../store/wishlist";
import { deleteFromCart } from "../store/cart";
import { AnimatePresence, motion } from "framer-motion";
import { variantMobile, variantsRight } from "./utilities/variants";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";


export function WishlistNotification({ isAddedToWishlist, message, icon }) {
  const isBigScreen = window.matchMedia("(min-width: 768px)").matches;
  const navigate = useNavigate();
  return createPortal(
    <AnimatePresence>
      {isAddedToWishlist && (
        <motion.div
          key="wishlist"
          initial={isBigScreen ? "closed" : "initial"}
          transition="transition" // Set 'initial' based on variants
          animate={isBigScreen ? "open" : "animate"} // Set 'animate' based on variants
          exit={isBigScreen ? "closed" : "exit"} // Set 'exit' based on variants
          variants={isBigScreen ? variantsRight : variantMobile}
          role="alert" // ARIA role for alerts
          aria-live="assertive" // ARIA live region type
          aria-atomic="true" // ARIA atomic property
          onClick={(e) => {
            e.stopPropagation();
          }} //
          className="fixed top-16 max-h-48 p-1 flex justify-center md:mx-3 rounded-lg  left-1/2 md:translate-x-0 md:top-16 lg:top-20 md:left-auto md:right-0 w-72 md:w-1/3 bg-primary/90 lg:max-w-xs "
        >
          <div className="m-4 flex flex-col gap-4 justify-center">
            <div
              className="flex justify-center items-center gap-2  flex-wrap  "
              aria-label={message} // Add aria-label to provide context
            >
              {icon ? <Favorite /> : <FavoriteBorder />}
              <span className="text-lg text-center text-balance text-primary-black lg:text-lg font-bold">
                {message}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              role="button"
              onClick={() => navigate("/dashboard/wishlist")}
              aria-label="Go to your wishlist"
              className="max-w-sm h-10 p-4 uppercase text-sm flex justify-center items-center rounded-md font-semibold bg-primary-btn hover:bg-primary-hover"
            >
              Go to your wishlist
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/* Quando viene chiamato createPortal, 
il componente o l'elemento fornito come primo argomento (child) 
viene estratto dal componente padre corrente 
e montato nel nodo del DOM specificato come secondo argomento (container), 
mantenendo tuttavia il suo contesto React originale, 
inclusi gli eventuali eventi o dati associati.
Ciò può essere particolarmente utile quando si desidera
che un componente venga visualizzato in una posizione specifica all'interno del DOM, 
ad esempio al di fuori della gerarchia di componenti principali 
o in una parte specifica della pagina. */

export const WishlistButton = ({
  product,
  primary,
  secondary,
  onWishlistClicked,
  label,
  cart,
  handleMoveToWishlist,
}) => {
  // Create a theme using primary and secondary colors
  const theme = createTheme({
    palette: {
      heart: {
        main: primary,
      },
      border: {
        main: secondary,
      },
    },
  });

  // Redux dispatch
  const dispatch = useDispatch();

  // Check if the product is added to the wishlist by checking the Redux state
  const isAddedToWishlist = useSelector((state) =>
    state.wishlist?.some(
      (wishlistItem) => wishlistItem.product.id === product.id,
    ),
  );

  /*   // Check if the product is added to the wishlist by checking the Redux state
  const isAddedToCart = useSelector((state) =>
    state.cart?.some(
      (cartItem) => cartItem.product.id === product.id,
    ),
  ); */

  // State to manage the visibility of the notification
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const [hover, setHover] = useState(false);

  // Handle the click event on the Wishlist button
  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    

    if (isAddedToWishlist) {
      // If the product is already in the wishlist, remove it and hide the notification
      dispatch(removeProductFromWishlist(product));
      setIsNotificationVisible(true);
      setMessage("Product Removed from Wishlist!");
      setAdded(false);
    } else {
      // If the product is not in the wishlist, add it, show the notification, and set a timeout to hide it
      dispatch(addProductToWishlist({ product: product, quantity: 1 }));
      dispatch(deleteFromCart({ id: product.id }));
      setIsNotificationVisible(true);
      setAdded(true);
      setMessage("Added To Wishlist!");
    }

    const timeout = setTimeout(() => {
      setIsNotificationVisible(false);
      setMessage("");
    }, 2500);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeout);
  };

 

/*   // Pass the value of isNotificationVisible to the parent component via the onWishlistClicked prop
  useEffect(() => {
    onWishlistClicked(isNotificationVisible);
  }, [isNotificationVisible]); */

  /* la notifica verrà attivata quando "isAddedToWishlist" diventa true, 
rimarrà visibile per 2,5 secondi e poi verrà automaticamente rimossa 
impostando lo stato "isNotificationVisible" a false. */

  return (
    <>
      <ThemeProvider theme={theme}>
        <IconButton
          title="Wishlist"
          onClick={cart ? handleMoveToWishlist : handleToggleWishlist}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disableRipple={true}
          aria-label={
            isAddedToWishlist ? "Remove from Wishlist" : "Add to Wishlist"
          }
        >
          {hover ? (
            <Favorite color="heart" className="active:animate-ping" />
          ) : isAddedToWishlist ? (
            <Favorite color="heart" className="active:animate-ping" />
          ) : (
            <FavoriteBorder
              color="border"
              className="p-0 active:animate-ping"
            />
          )}
          {label && (
            <motion.label
              whileTap={{ scale: 0.95 }}
              className={`pl-2 cursor-pointer  ${cart ? "text-slate-700 text-xs  " : "text-slate-100 text-base"}`}
            >
              {isAddedToWishlist
                ? "Added to Wishlist"
                : cart
                  ? "Move to Wishlist"
                  : "Add to Wishlist"}
            </motion.label>
          )}
        </IconButton>
      </ThemeProvider>
      {!cart ? (
        <WishlistNotification
          isAddedToWishlist={isNotificationVisible}
          message={message}
          icon={added}
        />
      ) : null}
    </>
  );
};
