import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  latests: JSON.parse(localStorage.getItem("latests")) || [],
  error: "",
};

export const fetchLatest = createAsyncThunk("latest/fetchLatest", () => {
  return axios
    .get("https://test-api-rwgb.onrender.com/latest")
    .then((response) => response.data);
});

const latestSlice = createSlice({
  name: "latests",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLatest.pending, (state) => {
      state.loading = true;
    }),
      builder.addCase(fetchLatest.fulfilled, (state, action) => {
        state.loading = false;
        // Verifica se i dati ottenuti dall'API sono diversi dai dati salvati in cache
        if (JSON.stringify(state.latests) !== JSON.stringify(action.payload)) {
          state.latests = action.payload;
          // Salva i dati nella cache locale del browser solo se sono diversi
          localStorage.setItem("latests", JSON.stringify(action.payload));
        }
        state.error = "";
      }),
      builder.addCase(fetchLatest.rejected, (state, action) => {
        (state.loading = false),
          (state.latests = []),
          (state.error = action.error.message);
      });
  },
});

export default latestSlice.reducer;
