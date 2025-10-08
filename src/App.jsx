// App.js
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './store/store';

import AssigneesPages from "./Pages/AssigneesPages";
import ProjectPage from "./Pages/ProjectPage";
import TaskPage from "./Pages/TaskPage";
import LoginPage from "./layout/LoginPage";
import Signup from "./layout/Signup";
import SideWithNav from "./layout/SideWithNav";
import ErrorPage from "./Pages/ErrorPage";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
}

const AppContent = () => {
  const location = useLocation();
  // const history = useNavigate()
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup'   || location.pathname === '/error';

  // if (!localStorage.getItem('user')) {
  //   history("/login")
  // }

  return (
    <>
      {!hideNavbar && <SideWithNav />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/error" element={<ErrorPage />} />
        
        <Route path="*" element={<Navigate to="/error" replace />} />

        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignees"
          element={
            <ProtectedRoute>
              <AssigneesPages />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

export default App