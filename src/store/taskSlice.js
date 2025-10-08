import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios"; // Axios instance with JWT
import axios from "axios";


// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://taskmanage-api-backend-2.onrender.com/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
    }
  }
);

// Add new task
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tasks", {
        ...taskData,
        start_date: taskData.start_date,
        end_date: taskData.end_date,
      });
      return { ...taskData, id: response.data.taskId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add task");
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem("token");
      const state = getState();

      const assignees = state.assignees.items || [];
      const projects = state.projects.items || [];

      // 🧠 Convert assignee name or object → ID
      let assigneeId;
      if (typeof taskData.assignee === "object") {
        assigneeId = taskData.assignee.id;
      } else if (isNaN(taskData.assignee)) {
        // If it's a name (e.g. "Vijaykumar Yadav"), find the matching ID
        const match = assignees.find(
          (a) => a.name === taskData.assignee
        );
        assigneeId = match ? match.id : null;
      } else {
        assigneeId = parseInt(taskData.assignee);
      }

      // 🧠 Convert project name or object → ID
      let projectId;
      if (typeof taskData.project === "object") {
        projectId = taskData.project.id;
      } else if (isNaN(taskData.project)) {
        // If it's a name (e.g. "Quid Dashboard"), find the matching ID
        const match = projects.find(
          (p) => p.name === taskData.project
        );
        projectId = match ? match.id : null;
      } else {
        projectId = parseInt(taskData.project);
      }

      // 🛑 Safety check before sending
      if (!assigneeId || !projectId) {
        return rejectWithValue("Invalid assignee or project selected.");
      }

      // ✅ Build payload with clean IDs
      const payload = {
        title: taskData.title || "",
        description: taskData.description || "",
        project: projectId,
        assignee: assigneeId,
        priority: taskData.priority || "Medium",
        status: taskData.status || "Pending",
        start_date:
          taskData.start_date ||
          new Date().toISOString().split("T")[0],
        end_date:
          taskData.end_date ||
          new Date().toISOString().split("T")[0],
      };

      console.log("📦 Sending payload to Flask:", payload);

      const res = await axios.put(
        `https://taskmanage-api-backend-2.onrender.com/tasks/${taskData.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return res.data;
    } catch (err) {
      console.error("❌ Update task error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to update task"
      );
    }
  }
);


// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.delete(`https://taskmanage-api-backend-2.onrender.com/tasks/${taskId}`, {
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  data: { username: user.name, role: user.role },
});

      console.log("Token being sent:", token);
      console.log("Deleted task response:", res.data);
      return taskId;
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || "Failed to delete task");
    }
  }
);



const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default taskSlice.reducer;
