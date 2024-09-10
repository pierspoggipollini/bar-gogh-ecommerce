import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as CartActions from "../../../store/cart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";
import "./CartButton.css";
import { removeProductFromWishlist } from "../../../store/wishlist";
import axios from "axios";
import apiBaseUrl from "../../../config/apiConfig";

 const CartButtonSmall = ({ product, quantity, onButtonClicked }) => {
   const dispatch = useDispatch();

   const cartButton = `bg-primary-btn w-14 py-2 ml-auto text-center rounded-lg`;

   const [isAdded, setIsAdded] = useState(false);
   const [isAdding, setIsAdding] = useState(false);

   // Check if the product is added to the wishlist by checking the Redux state
   const isAddedToWishlist = useSelector((state) =>
     state.wishlist?.some(
       (wishlistItem) => wishlistItem.product.id === product.id,
     ),
   );

     const fetchAvailableQuantity = async (productId) => {
       try {
         // Fetch available quantity from the backend API
         const response = await axios.get(
           `${apiBaseUrl}products/availableQuantity/${productId}`,
         );

         // Extract availableQuantity from the response data
         const { availableQuantity } = response.data;
         return availableQuantity;
       } catch (error) {
         // Handle errors if fetching fails
         console.error("Error fetching available quantity:", error);
         return 0; // Set a default quantity or handle the error appropriately
       }
     };

     const [availableQuantity, setAvailableQuantity] = useState(null);

     useEffect(() => {
       // Define an asynchronous function to fetch the available quantity
       const fetchQuantity = async () => {
         try {
           // Call fetchAvailableQuantity to get the quantity for the given product ID
           const quantity = await fetchAvailableQuantity(product.id);

           // Set the available quantity state once it's retrieved successfully
           setAvailableQuantity(quantity);
         } catch (error) {
           // If there's an error fetching the quantity, log the error
           console.error("Error fetching available quantity:", error);

           // Set a default quantity (in this case, 0) or handle the error appropriately
           setAvailableQuantity(0);
         }
       };

       // Call fetchQuantity immediately when the component mounts and whenever product.id changes
       fetchQuantity();
     }, [product.id]);

   const handleCart = (e) => {
     e.preventDefault();
     e.stopPropagation();

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

     const timeout = setTimeout(() => {
       setIsAdding(false);
       setIsAdded(true);
       setTimeout(() => setIsAdded(false), 2000);
     }, 300);

     // Clear the timeout to prevent memory leaks when the component unmounts
     return () => clearTimeout(timeout);
   };

   useEffect(() => {
     onButtonClicked(isAdded);
   }, [isAdded]);

   return (
     <>
       <motion.button
         whileTap={{ scale: 0.95 }}
         onClick={handleCart}
         disabled={
           isAdding || availableQuantity === 0 || availableQuantity === null
         }
         aria-label="Add to cart"
         className={`${cartButton} disabled:cursor-not-allowed  ${isAdding ? "is-adding" : ""}`}
       >
         <span className="icon">
           {isAdded ? <CheckIcon /> : <ShoppingCartIcon />}
         </span>
       </motion.button>
     </>
   );
 };

export default CartButtonSmall

{
  /*  <button
        onClick={handleCart}
        aria-label="Add to cart"
        className="hidden md:w-full lg:ml-auto text-sm md:flex justify-center items-center gap-1 relative mt-1 py-4 px-4 bg-primary-btn hover:bg-primary-hover cursor-pointer rounded-2xl"
      >
        <ShoppingCartIcon fontSize="small" />
        Add to Cart
      </button> */
}
