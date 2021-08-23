import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utils/baseURL";

//action for redirect
const resetAcc = createAction("account/verify-reset");

//create verification token
export const accVerificationSendTokenAction = createAsyncThunk(
  "account/token",
  async (email, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    //http call
    try {
      const { data } = await axios.post(
        `${baseUrl}/api/users/generate-verify-email-token`,
        {},
        config
      );

      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Verify Account
export const verifyAccountAction = createAsyncThunk(
  "account/verify",
  async (token, { rejectWithValue, getState, dispatch }) => {
    //get user token
    const user = getState()?.users;
    const { userAuth } = user;
    const config = {
      headers: {
        Authorization: `Bearer ${userAuth?.token}`,
      },
    };
    //http call
    try {
      const { data } = await axios.put(
        `${baseUrl}/api/users/verify-account`,
        { token },
        config
      );
      //dispatch
      dispatch(resetAcc());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//slices

const accountVericationSlices = createSlice({
  name: "account",
  initialState: {},
  extraReducers: builder => {
    //create
    builder.addCase(accVerificationSendTokenAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(
      accVerificationSendTokenAction.fulfilled,
      (state, action) => {
        state.token = action?.payload;
        state.loading = false;
        state.appErr = undefined;
        state.serverErr = undefined;
      }
    );
    builder.addCase(
      accVerificationSendTokenAction.rejected,
      (state, action) => {
        state.loading = false;
        state.appErr = action?.payload?.message;
        state.serverErr = action?.error?.message;
      }
    );

    //Verify account
    builder.addCase(verifyAccountAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetAcc, (state, action) => {
      state.isVerified = true;
    });
    builder.addCase(verifyAccountAction.fulfilled, (state, action) => {
      state.verified = action?.payload;
      state.loading = false;
      state.isVerified = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(verifyAccountAction.rejected, (state, action) => {
      state.loading = false;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default accountVericationSlices.reducer;
