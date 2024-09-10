import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  products: JSON.parse(localStorage.getItem("products")) || [],
  error: "",
};

/* export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios
    .get("https://test-api-rwgb.onrender.com/products");
  return response.data;
});
 */
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProducts : (state, action) => {
      return state.products = action.payload
    }
  }
  /* extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;

        // Verifica se i dati ottenuti dall'API sono diversi dai dati salvati in cache
        if (JSON.stringify(state.products) !== JSON.stringify(action.payload)) {
          state.products = action.payload;
          // Salva i dati nella cache locale del browser solo se sono diversi
          localStorage.setItem("products", JSON.stringify(action.payload));
        }
        state.error = "";
      }),
      builder.addCase(fetchProducts.rejected, (state, action) => {
        (state.loading = false),
          (state.products = []),
          (state.error = action.error.message);
      });
  }, */
});

export default productsSlice.reducer;
