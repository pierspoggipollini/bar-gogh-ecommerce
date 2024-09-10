import React, { useState } from "react";
import "../CartButton/CartButton.css";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { useDispatch } from "react-redux";
import * as CartActions from "../../../store/cart";
import { Check } from "@mui/icons-material";
import { motion } from "framer-motion";


export const RemoveFromCart = ({ itemId, onRemove }) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);


  const dispatch = useDispatch();

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);

    setTimeout(() => {
      setIsRemoving(false);
      setIsRemoved(true);
      setTimeout(() => {
        setIsRemoved(false);
        dispatch(
          CartActions.deleteFromCart({
            id: itemId,
          }),
        );
        onRemove();
      }, 2000);
    }, 1000);
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleRemove}
        disabled={isRemoving}
        className={` remove-button ${
          isRemoving || isRemoved ? "removing" : ""
        }`}
      >
        <span className="icon">
          {isRemoved ? <Check /> : <RemoveShoppingCartIcon />}
        </span>

        <span className="text">
          {isRemoving ? "Removing..." : isRemoved ? "Removed" : "Remove"}
        </span>
      </motion.button>
    </>
  );
};
