import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import Users from "./components/Users";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import Memberships from "./components/DashboardComponents/Memberships";

// Create a wrapper component to use useLocation outside Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {!isLoginPage && (
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div className="flex flex-1 overflow-hidden">
        {!isLoginPage && <Sidebar sidebarOpen={sidebarOpen} />}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <Users />
                </PrivateRoute>
              }
            />
              <Route
              path="/memberships"
              element={
                <PrivateRoute>
                  <Memberships />
                </PrivateRoute>
              }
            />
          </Routes>
          {!isLoginPage && <Footer />}
        </div>
      </div>
    </div>
  );
}

export default AppWrapper;
