import { Navigate } from "react-router-dom";

// /affarssystem är konsoliderad in i /erp (pelarsida för affärssystem/ERP).
const Affarssystem = () => <Navigate to="/erp/" replace />;

export default Affarssystem;
