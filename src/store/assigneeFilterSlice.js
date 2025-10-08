import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // axios instance with JWT

// Async thunk to fetch assignees from backend
export const fetchAssignees = createAsyncThunk(
  "assignees/fetchAssignees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/assignees"); // JWT automatically sent via interceptor
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch assignees");
    }
  }
);

const assigneeSlice = createSlice({
  name: "assigneeFilter",
  initialState: {
    selectedAssignee: "",
    assignees: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedAssignee: (state, action) => {
      state.selectedAssignee = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignees.fulfilled, (state, action) => {
        state.loading = false;
        state.assignees = action.payload;
      })
      .addCase(fetchAssignees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedAssignee } = assigneeSlice.actions;
export default assigneeSlice.reducer;
