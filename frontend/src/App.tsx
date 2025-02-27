import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import FileUploadPage from "./pages/FileUploadPage";
import DashboardPage from "./pages/DashboardPage";
import OtpPage from "./pages/OtpPage";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/file-upload" element={<FileUploadPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/verify-email" element={<OtpPage />} />
      
      </Routes>
    </Router>
  );
}