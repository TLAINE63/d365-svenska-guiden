import { Navigate } from "react-router-dom";

// Redirect to the new unified admin dashboard
const PartnerAdmin = () => {
  return <Navigate to="/admin" replace />;
};

export default PartnerAdmin;
