import React, { useEffect, useState } from "react";
import { DashHeader } from "../DashHeader";
import { FavoriteBorderOutlined, PersonOutline } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import * as WishlistActions from "../../../store/wishlist";
import * as CartActions from "../../../store/cart";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Message } from "../Message/Message";
import { CartItem } from "../../Cart/CartItem/CartItem";
import { useMessageContext } from "../Message/MessageContext";

export const Wishlist = ({  }) => {
  const wishlist = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];
    dispatch(WishlistActions.setWishlist(storedWishlist));
  }, [dispatch]);

  const navigate = useNavigate();
  const NoWishlist = (
    <div
      className="flex h-64 max-w-full items-center justify-center gap-2 rounded-lg bg-slate-100  p-4"
      role="region"
    >
      <div className="flex w-auto flex-col items-center gap-2 text-center">
        <h1 className="text-base lg:text-lg font-semibold">
          Currently, you have no products.
        </h1>
        <motion.button
          role="button"
          aria-label="Shop Now"
          whileTap={{ scale: 0.95 }}
          className="my-3 uppercase flex h-12 w-64 items-center justify-center rounded-md bg-primary-btn  p-2 font-semibold hover:bg-primary-hover"
          onClick={() => navigate("/products/category/all")}
        >
          Shop Now
        </motion.button>
      </div>
    </div>
  );


   const {
     isNotificationVisible,
     showSuccessMessage,
     showErrorMessage,
     text,
   } = useMessageContext();


  const handleRemoveItem = (e, product) => {
    e.preventDefault();
    const removed = dispatch(
      WishlistActions.removeProductFromWishlist(product),
    );

    if (removed) {
      showSuccessMessage("Removed from wishlist");
    } else {
      showErrorMessage("Error during the process");
    }

    window.scrollTo(0, 0);
  };

  const addToCart = (product, quantity) => {
    const added = dispatch(
      CartActions.addItem({
        product: product,
        quantity: quantity,
      }),
    );

    if (added) {
      dispatch(WishlistActions.removeProductFromWishlist(product));
      showSuccessMessage("Item added to your cart.");
    } else {
      showErrorMessage("Error during the process");
    }
    window.scrollTo(0, 0);
  };

  const wishlistItems = wishlist.map((item, index) => {
    const productId = item.product?.id || item?.id;
    const productImage = item.product?.image[0] || item.image[0];
    const productCategory = (item.product?.category || item?.category).join(
      ", ",
    );
    const productTitle = item.product?.title || item?.title;
    const productPrice = item.product?.price || item?.price;
    const productQuantity = item?.quantity || 1;
    const product = item.product || item;

    return (
      <React.Fragment key={productId}>
        <CartItem
          wishlist={true}
          key={productId}
          itemId={productId}
          image={productImage}
          category={productCategory}
          title={productTitle}
          price={productPrice}
          grams={500}
          quantity={productQuantity}
          link={`/products/${productId}`}
          product={item.product || item}
          removeFromWishlist={(e) => handleRemoveItem(e, product)}
          addedToCart={(quantity) => addToCart(item.product || item, quantity)}
        />
      </React.Fragment>
    );
  });

  return (
    <div
      className={`${wishlist.length > 0 ? "xs:max-w-[29.75rem] " : "max-w-full"} grid gap-2`}
    >
      <DashHeader
       /*  backPage="/dashboard" */
        backIcon={<PersonOutline sx={{ fontSize: "1.8rem" }} />}
        title="My Wishlist"
        icon={<FavoriteBorderOutlined fontSize="large" />}
      />
      <Message />
      {wishlist.length > 0 ? wishlistItems : NoWishlist}
    </div>
  );
};
