import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "./revertAll";

const subtotal = parseFloat(sessionStorage.getItem("subtotal"));
const shipCost = subtotal <= 50 ? 5 : 0;


// Initial state for the checkout feature
export const cartInitialState = {
  // Retrieve cart items from sessionStorage, parse as JSON array; default to empty array if null or undefined
  items: JSON.parse(sessionStorage.getItem("cartItems")) || [],

  // Retrieve subtotal from sessionStorage, parse as float; default to 0 if null or undefined
  subtotal: subtotal || 0,

  // Initial shipping cost based on subtotal
  ship: shipCost,

  // Whether customer opts for in-store pickup (false by default)
  pickupInStore: false,

  // Total order amount (0 by default)
  totalOrder: 0,

  // Amount of discount applied (0 by default)
  discountAmount: 0,

  // Flag indicating if a discount is currently applied (false by default)
  discountApplied: false,
};


export const cartSlice = createSlice({
  name: "cart",
  initialState: cartInitialState,
  reducers: {
    // Adds an item to the cart or updates its quantity
    addItem: (state, action) => {
      const { product, quantity } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) => item.product.id === product.id,
      );

    
      if (itemIndex === -1) {
        // If the product doesn't exist in the cart, add it
        state.items.push({ product, quantity });
      } else {
        // If the product already exists, update only the quantity
        state.items[itemIndex].quantity += quantity;
      }
      sessionStorage.setItem("cartItems", JSON.stringify(state.items));

      // Calls the updateSubtotal action to update the subtotal
      cartSlice.caseReducers.updateSubtotal(state);
    },

    // Deletes an item from the cart
    deleteFromCart: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter((item) => item.product.id !== id);

      sessionStorage.setItem("cartItems", JSON.stringify(state.items));

      cartSlice.caseReducers.updateSubtotal(state);
    },

    // Updates the quantity of an item in the cart
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      state.items = state.items.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: quantity,
          };
        }
        return item;
      });

      sessionStorage.setItem("cartItems", JSON.stringify(state.items));

      // Calls the updateSubtotal action to update the subtotal
      cartSlice.caseReducers.updateSubtotal(state);
    },

    // Updates the subtotal based on the items in the cart
    updateSubtotal: (state, action) => {
      let subtotal = state.items.reduce((total, item) => {
        return total + parseFloat(item.product.price) * item.quantity;
      }, 0);

      if (state.discountApplied && subtotal >= 50) {
        const discountAmount =
          (parseFloat(state.discountAmount) / 100) * subtotal;
        const discountedTotal = (subtotal - discountAmount).toFixed(2);
        subtotal = parseFloat(discountedTotal);
      } else {
        state.subtotal = subtotal;
      }

      state.subtotal = parseFloat(subtotal);
      sessionStorage.setItem("subtotal", state.subtotal);

      state.ship = parseFloat(subtotal) <= 50 ? 5 : 0;

      state.totalOrder = parseFloat(state.subtotal + state.ship);
    },

    // Updates the shipping cost
    updateShip: (state, action) => {
      state.ship = action.payload;
      state.pickupInStore = false;
    },

    // Sets the pickupInStore flag
    setPickupInStore: (state, action) => {
      state.pickupInStore = action.payload;
      if (action.payload) {
        state.ship = "Gratis";
      }
    },

    // Applies a discount to the cart
    applyDiscount: (state, action) => {
      const { discount } = action.payload;

      if (discount.valid && state.subtotal >= 50) {
        const prevTotal = state.subtotal;
        const discountAmount =
          Math.round((parseFloat(discount.value) / 100) * prevTotal * 100) / 100;
        const discountedTotal = (prevTotal - discountAmount).toFixed(2);
        state.discountApplied = true;
        state.discountAmount = parseFloat(discountAmount);

        state.totalOrder = parseFloat(discountedTotal + state.ship);
      } else {
        state.discountApplied = false;
      }
    },

    // Updates the total order amount
    updateTotalOrder: (state, action) => {
      state.totalOrder = action.payload;
    },

    // Resets the entire cart state
    resetCart: (state) => {
      // Clear the sessionStorage data
      sessionStorage.removeItem("cartItems");
      sessionStorage.removeItem("subtotal");
      //Reset
      state.items = [];
      state.subtotal = 0;
      state.ship = shipCost;
      state.pickupInStore = false;
      state.totalOrder = 0;
      state.discountAmount = 0;
      state.discountApplied = false;
    },

    // Gets the quantity of a product in the cart
    getProductQuantity: (state, action) => {
      const quantity = state.find(
        (item) => item.id === action.payload.id,
      )?.quantity;
      if (quantity === undefined) {
        return 0;
      }
      return quantity;
    },

    // Adds one to the quantity of a product in the cart
    addOneToCart: (state, action) => {
      const quantity = state.getProductQuantity({ id: action.payload.id });
      if (quantity == 0) {
        state.push({ id: action.payload.id, quantity: 1 });
      } else {
        return state.map((cartItem) => {
          cartItem.id === action.payload.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem;
        });
      }
    },

    // Gets the subtotal of the cart
    getSubtotal: (state) => {
      return state.cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    },
  },
  extraReducers: (builder) =>
    builder.addCase(revertAll, () => cartInitialState),
});


export const {
  addItem,
  removeItem,
  updateQuantity,
  addOneToCart,
  deleteFromCart,
  resetCart,
  getSubtotal,
  updateSubtotal,
  applyDiscount,
  updateTotalOrder,
  updateShip,
  setPickupInStore

} = cartSlice.actions;
export default cartSlice.reducer;
