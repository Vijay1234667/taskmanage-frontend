import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import projectReducer from './projectSlice';
import assigneeReducer from './assigneeSlice';
import projectFilterReducer from "./projectFilterSlice";
import assigneeFilterReducer from "./assigneeFilterSlice";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
    projects: projectReducer,
    assignees: assigneeReducer,
    projectFilter: projectFilterReducer,
    assigneeFilter: assigneeFilterReducer,
  },
});

export default store;
