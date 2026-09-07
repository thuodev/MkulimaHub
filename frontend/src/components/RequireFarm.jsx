import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireFarm = ({ children }) => {
  const { selectedFarm } = useAuth();

  if (!selectedFarm) return <Navigate to="/farms" replace />;

  return children;
};

export default RequireFarm;
