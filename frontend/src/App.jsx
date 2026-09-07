import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireFarm from "./components/RequireFarm";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmSelect from "./pages/FarmSelect";
import Dashboard from "./pages/Dashboard";
import Fields from "./pages/Fields";
import Inputs from "./pages/Inputs";
import Stock from "./pages/Stock";
import Livestock from "./pages/Livestock";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/farms"
            element={
              <ProtectedRoute>
                <FarmSelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RequireFarm>
                  <Dashboard />
                </RequireFarm>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fields"
            element={
              <ProtectedRoute>
                <RequireFarm>
                  <Fields />
                </RequireFarm>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inputs"
            element={
              <ProtectedRoute>
                <RequireFarm>
                  <Inputs />
                </RequireFarm>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <RequireFarm>
                  <Stock />
                </RequireFarm>
              </ProtectedRoute>
            }
          />
          <Route
            path="/livestock"
            element={
              <ProtectedRoute>
                <RequireFarm>
                  <Livestock />
                </RequireFarm>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/farms" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
