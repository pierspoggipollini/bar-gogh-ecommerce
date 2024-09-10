import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "./revertAll";


export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    setWishlist(state, action) {
      return action.payload;
    },
    addProductToWishlist(state, action) {
      const productId = action.payload.product.id;
      const index = state.findIndex((p) => p.product.id === productId);

      if (index === -1) {
        const newState = [...state, action.payload];
        localStorage.setItem('wishlistItems', JSON.stringify(newState));
        return newState;
      }

      return state;
    },

    removeProductFromWishlist(state, action) {
      const productId = action.payload.id;

      const updatedList = state.filter((p) => {
        return p.product.id !== productId;
      });

      localStorage.setItem('wishlistItems', JSON.stringify(updatedList));

      return updatedList;
    },

  },
  extraReducers: (builder) =>
    builder.addCase(revertAll, () => []),

});

export const { setWishlist, addProductToWishlist, removeProductFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;


