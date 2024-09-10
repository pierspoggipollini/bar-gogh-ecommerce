import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  bestsellers: JSON.parse(localStorage.getItem("bestsellers")) || [],
  error: "",
};

export const fetchBestsellers = createAsyncThunk(
  "bestseller/fetchBestsellers",
  () => {
    return axios
      .get("https://test-api-rwgb.onrender.com/bestseller")
      .then((response) => response.data);
  },
);

const bestellerSlice = createSlice({
  name: "bestsellers",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchBestsellers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchBestsellers.fulfilled, (state, action) => {
      state.loading = false;
      // Verifica se i dati ottenuti dall'API sono diversi dai dati salvati in cache
      if (
        JSON.stringify(state.bestsellers) !== JSON.stringify(action.payload)
      ) {
        state.bestsellers = action.payload;
        // Salva i dati nella cache locale del browser solo se sono diversi
        localStorage.setItem("bestsellers", JSON.stringify(action.payload));
      }
      state.error = "";
    });
    builder.addCase(fetchBestsellers.rejected, (state, action) => {
      state.loading = false;
      state.bestsellers = [];
      state.error = action.error.message;
    });
  },
});

export default bestellerSlice.reducer;
