import React, { useEffect, useRef, useState } from "react";

import { RatingStars } from "../RatingStars";
import images from "../images/images";
import { WishlistButton } from "../WishlistButton";
import { motion } from "framer-motion";
import CartButtonSmall from "../Cart/CartButton/CartButtonSmall";
import { CartButton, CartNotification } from "../Cart/CartButton/CartButton";
import { Block } from "@mui/icons-material";
import { useAvailableQuantity } from "../../ReactQuery/UseAvailableQuantity";
import loader from "../../assets/loading.svg"

export const CardProduct = ({
  Title,
  Image,
  Price,
  id,
  Description,
  Rating,
  wishlistItems,
  handleClick,
  products,
  quantity,
}) => {
  const [wishlistMessage, setWishlistMessage] = useState(false);

  const [isAdded, setIsAdded] = useState(false);

  const handleButtonClicked = (value) => {
    // Qui riceviamo il valore da WishlistButton quando il pulsante viene cliccato
    setIsAdded(value);
  };

  const handleWishlistButtonClicked = (value) => {
    setWishlistMessage(value);
  };

  // Ref to keep track of the previous "added" state
  const prevIsAddedRef = useRef(isAdded);

  const {
    data: availableQuantity,
    error,
    isError,
    isLoading,
  } = useAvailableQuantity(id);


  return (
    <>
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 0.95 }}
        className=" relative h-[20rem] lg:h-[28.125rem] lg:max-h-[28.125rem] w-full max-w-[18rem] 2xl:max-w-[20rem] rounded-lg overflow-hidden cursor-pointer flex flex-col  bg-primary  lg:drop-shadow-2xl"
      >
        <div className=" relative h-[12rem] w-full rounded-t-lg  bg-slate-200">
          <img
            src={images[Image]}
            alt={Title}
            className="h-full w-full rounded-lg   object-contain"
          />
        </div>
        <div className="flex flex-col flex-1  px-3  gap-4">
          <div className="mt-3 text-[14px] lg:flex lg:items-center justify-between  lg:text-left">
            <h1 className="xl:text-md font-bold line-clamp-1 w-full max-w-full lg:max-w-[75%] pr-6 sm:text-[16px] ">
              {Title}
            </h1>
            <span className=" absolute bottom-5 lg:bottom-0  font-semibold text-[16px] lg:relative  xl:text-lg">
              {Price}
            </span>
          </div>
          <div className="-mt-2 flex">
            <RatingStars rating={Rating} size="small" />
          </div>

          <p className="hidden text-center text-xs leading-relaxed  lg:text-left lg:line-clamp-2">
            {Description}
          </p>

          {/*  <button className='w-full relative mt-1 py-3 px-12 bg-primary-btn rounded-2xl'>Add to Cart</button>
        <ShoppingCartIcon sx={{position: 'absolute', bottom: '1.6rem', left: '27%'}} /> */}
        </div>
        <div className="left-0 bottom-0 right-0 mx-2 mb-4">
          <div className="absolute top-2 right-2 ">
            <WishlistButton
              primary="red"
              secondary="rgb(51 65 85)"
              product={wishlistItems}
              onWishlistClicked={handleWishlistButtonClicked}
            />
          </div>
          <div className="hidden lg:flex lg:justify-center">
            {/* Display loader during loading */}
            {isLoading && <img src={loader} alt="loader" />}

            {/* Display "Not Available" message on error or zero/undefined availability */}
            {!isLoading &&
              (isError ||
                availableQuantity === 0 ||
                availableQuantity === null) && (
                <span className="cursor-not-allowed text-sm">
                  Not Available
                </span>
              )}

            {/* Display cart button if available quantity is greater than zero */}
            {!isLoading &&
              !isError &&
              availableQuantity !== 0 &&
              availableQuantity !== null && (
                <CartButton
                  product={products} // Make sure to pass the correct product here
                  quantity={quantity} // Make sure to pass the correct quantity here
                  onButtonClicked={handleButtonClicked}
                />
              )}
          </div>

        
            <div className="lg:hidden">
              {/* Display loader during loading */}
              {isLoading &&
               <div className=" absolute bottom-5 px-3 right-2  lg:hidden">
                  <img src={loader} alt="loader" />
               </div>
              }

              {/* Display "Not Available" message on error or zero/undefined availability */}
              {!isLoading &&
                (error ||
                  availableQuantity === 0 ||
                  availableQuantity === null) && (
                  <div className=" absolute bottom-5 px-3 right-2  lg:hidden">
                    <span className=" cursor-not-allowed text-sm">
                      <Block />
                    </span>
                  </div>
                )}

              {/* Display cart button if available quantity is greater than zero */}
              {!isLoading &&
                !error &&
                availableQuantity !== 0 &&
                availableQuantity !== null && (
                  <div className="absolute bottom-3 px-3 right-0 ">
                    <CartButtonSmall
                    product={products}
                    quantity={quantity}
                    onButtonClicked={handleButtonClicked}
                  />
                  </div>
                
                )}
            </div>
       
        </div>
      </motion.div>

      <CartNotification
        title="Article added to cart"
        addItem={isAdded}
        portalRef={prevIsAddedRef}
        onRemove={() => setIsAdded(false)}
      />

      {/*  <WishlistNotification isAddedToWishlist={wishlistMessage} /> */}
    </>
  );
};
