import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coins: [],
  loading: false,
  error: null,
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    fetchCoinsStart: (state) => {
      state.loading = true;
    },
    fetchCoinsSuccess: (state, action) => {
      state.coins = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCoinsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchCoinsStart, fetchCoinsSuccess, fetchCoinsFailure } =
  cryptoSlice.actions;
export default cryptoSlice.reducer;
