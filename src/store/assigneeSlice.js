import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // axios instance with JWT

// Fetch all assignees
export const fetchAssignees = createAsyncThunk(
  "assignees/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/assignees"); // JWT automatically included
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch assignees");
    }
  }
);

// Delete an assignee by ID
export const deleteAssignee = createAsyncThunk(
  "assignees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assignees/${id}`); // JWT automatically included
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete assignee");
    }
  }
);

const assigneeSlice = createSlice({
  name: "assignees",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAssignees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAssignee.fulfilled, (state, action) => {
        state.items = state.items.filter((a) => a.id !== action.payload);
      })
      .addCase(deleteAssignee.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default assigneeSlice.reducer;
