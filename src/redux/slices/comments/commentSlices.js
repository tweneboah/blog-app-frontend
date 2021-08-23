import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import baseUrl from "../../../utils/baseURL";

//action to redirect
const resetCommentAction = createAction("comment/reset");
//create
export const createCommentAction = createAsyncThunk(
  "comment/create",
  async (comment, { rejectWithValue, getState, dispatch }) => {
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
        `${baseUrl}/api/comments`,
        {
          description: comment?.description,
          postId: comment?.postId,
        },
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

//delete
export const deleteCommentAction = createAsyncThunk(
  "comment/delete",
  async (commentId, { rejectWithValue, getState, dispatch }) => {
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
      const { data } = await axios.delete(
        `${baseUrl}/api/comments/${commentId}`,
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

//Update
export const updateCommentAction = createAsyncThunk(
  "comment/update",
  async (comment, { rejectWithValue, getState, dispatch }) => {
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
        `${baseUrl}/api/comments/${comment?.id}`,
        { description: comment?.description },
        config
      );
      //dispatch
      dispatch(resetCommentAction());
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//fetch comment details
export const fetchCommentAction = createAsyncThunk(
  "comment/fetch-details",
  async (id, { rejectWithValue, getState, dispatch }) => {
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
      const { data } = await axios.get(`${baseUrl}/api/comments/${id}`, config);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);
const commentSlices = createSlice({
  name: "comment",
  initialState: {},
  extraReducers: builder => {
    //create
    builder.addCase(createCommentAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentCreated = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(createCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.commentCreated = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    //delete
    builder.addCase(deleteCommentAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentDeleted = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(deleteCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.commentCreated = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    //update
    builder.addCase(updateCommentAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(resetCommentAction, (state, action) => {
      state.isUpdate = true;
    });
    builder.addCase(updateCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentUpdated = action?.payload;
      state.isUpdate = false;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(updateCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.commentCreated = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });

    //fetch details
    builder.addCase(fetchCommentAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCommentAction.fulfilled, (state, action) => {
      state.loading = false;
      state.commentDetails = action?.payload;
      state.appErr = undefined;
      state.serverErr = undefined;
    });
    builder.addCase(fetchCommentAction.rejected, (state, action) => {
      state.loading = false;
      state.commentCreated = undefined;
      state.appErr = action?.payload?.message;
      state.serverErr = action?.error?.message;
    });
  },
});

export default commentSlices.reducer;
