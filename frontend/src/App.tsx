import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import FileUploadPage from "./pages/FileUploadPage";
import DashboardPage from "./pages/DashboardPage";
import OtpPage from "./pages/OtpPage";
import ProtectedRoute from "./components/protectedRoute";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "sonner"; 
import ReportPage from "./pages/ReportPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/verify-email" element={<OtpPage />} />
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/" element={<DashboardPage />} />
          {/* </Route> */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/file-upload" element={<FileUploadPage />} />
          {/* </Route> */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/report" element={<ReportPage />} />
          {/* </Route> */}
        </Routes>
      </Router>
      <Toaster richColors position="bottom-right" duration={3000} /> 
    </AuthProvider>
  );
}
