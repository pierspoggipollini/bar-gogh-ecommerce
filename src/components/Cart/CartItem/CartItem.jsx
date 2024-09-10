import React, { useEffect, useState } from "react";
import images from "../../images/images";
import { useNavigate } from "react-router";
import {
  DeleteForeverOutlined,
  KeyboardArrowDownOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import * as CartActions from "../../../store/cart";
import { AnimatePresence, motion } from "framer-motion";
import { WishlistButton } from "../../WishlistButton";
import useCurrencyFormatter from "../../utilities/currency/useCurrencyFormatter";
import SelectQty from "../../Input/SelectQty";

export const CartItem = ({
  wishlist,
  removeFromCart,
  image,
  category,
  title,
  grams,
  price,
  itemId,
  product,
  quantity,
  link,
  onRemove,
  removeFromWishlist,
  addedToCart,
  handleMoveToWishlist,
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const priceUpdate = price * selectedQuantity;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formatAmount = useCurrencyFormatter();


  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    setSelectedQuantity(newQuantity);
    dispatch(
      CartActions.updateQuantity({
        productId: product.id,
        quantity: newQuantity,
      }),
    );
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      CartActions.deleteFromCart({
        id: itemId,
      }),
    );
    onRemove();
    window.scrollTo(0, 0);
  };

  // Check if the product is added to the wishlist by checking the Redux state
  const isAddedToWishlist = useSelector((state) =>
    state.wishlist?.some(
      (wishlistItem) => wishlistItem.product.id === product.id,
    ),
  );

  return (
    <>
      <AnimatePresence>
        <motion.div className=" max-w-full xs:max-w-[29.75rem]  min-h-48 max-h-[21rem] z-0 md:max-h-96 overflow-hidden relative  p-2  md:h-full  flex flex-col xs:flex-row cursor-default bg-slate-200   transition-shadow rounded-lg">
          <div className="py-2 flex  justify-center xs:justify-start pl-1 pr-3 md:pl-2 md:py-2 md:pr-4">
            <div className=" h-32 rounded-lg flex justify-center flex-col items-center w-44  xs:w-32  max-h-56  bg-slate-300  overflow-hidden">
              <img
                src={images[image]}
                alt="product"
                className="cursor-pointer min-w-20 max-w-40 overflow-hidden max-h-40 "
                onClick={() => navigate(link)}
              />
            </div>
          </div>

          <div className=" flex flex-col gap-1.5 py-2 xs:pr-3 md:py-2 md:pr-2 max-h-80 max-w-full w-full xs:w-full  lg:w-[30rem] xs:relative   text-primary-black">
            <span
              aria-label="categories"
              className="text-xs uppercase line-clamp-1 pr-7  text-slate-600"
            >
              {category}
            </span>
            <h1
              aria-label="product title"
              className=" text-sm xs:text-base line-clamp-1 pr-7 md:pr-0  font-bold"
            >
              {title}
            </h1>
            <span aria-label="grams" className="text-xs text-slate-600">
              Grams: {grams} gr
            </span>
            <div className=" flex items-center py-4 justify-between md:gap-0">
              <SelectQty
                productId={itemId}
                selectedQuantity={selectedQuantity}
                onChange={handleQuantityChange}
                colorIcon="hsl(0 0% 12%)"
                classNameSpan="text-primary-black"
                classNameSelect="text-primary-black"
                
              />
              <span
                aria-label="price"
                className="tabular-nums pt-3 text-base md:text-lg font-semibold "
              >
                {formatAmount(priceUpdate)}
              </span>
            </div>

            <div className="flex flex-wrap w-full">
              <div className="flex order-1  justify-end gap-1 items-center mt-auto flex-1 ">
                <>
                  {wishlist ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addedToCart(selectedQuantity)}
                      className="group hover:brightness-110  relative h-11 min-w-28 hover:max-w-full p-2 flex justify-center gap-2 items-center text-xs uppercase transition-all duration-150 ease-in-out  bg-primary-btn rounded-lg font-semibold"
                    >
                      <ShoppingCartOutlined fontSize="small" />
                      Add
                    </motion.button>
                  ) : (
                    <WishlistButton
                      primary="hsl(32, 99%, 69%)"
                      secondary="hsl(32, 99%, 69%)"
                      product={product}
                      label={true}
                      handleMoveToWishlist={handleMoveToWishlist}
                      cart={true}
                    />
                  )}
                </>

                {wishlist ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    role="button"
                    aria-label="Remove"
                    title="Remove from Wishlist"
                    onClick={removeFromWishlist}
                    className=" absolute top-1 right-1 xs:top-0     p-1  xs:w-auto justify-center flex items-center  gap-2  hover:bg-slate-300 rounded-full"
                  >
                    {/* Imposta la visibilità dello span su 'hidden' per default e 'block' quando il pulsante è in hover */}
                    {/* <span className="text-slate-700 hidden text-xs">Remove</span> */}
                    <DeleteForeverOutlined
                      sx={{ height: "2rem", width: "2rem" }}
                    />
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    role="button"
                    aria-label="Remove"
                    title="Remove from Cart"
                    onClick={(e) => handleRemove(e)}
                    className=" absolute top-1 right-1 xs:top-0 xs:right-0  p-1 w-10 xs:w-auto justify-center flex items-center  gap-2  hover:bg-slate-300 rounded-full"
                  >
                    {/* Imposta la visibilità dello span su 'hidden' per default e 'block' quando il pulsante è in hover */}
                    {/* <span className="text-slate-700 hidden text-xs">Remove</span> */}
                    <DeleteForeverOutlined
                      sx={{ height: "2rem", width: "2rem" }}
                    />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};
