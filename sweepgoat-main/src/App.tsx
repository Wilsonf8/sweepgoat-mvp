import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from "./pages/LoginPage.tsx";
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { SuccessPage } from './pages/SuccessPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import {Routes, Route} from "react-router-dom";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/verify-email" element={<VerifyEmailPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/success" element={<SuccessPage />}/>
        <Route path="/privacy" element={<PrivacyPage />}/>
        <Route path="/terms" element={<TermsPage />}/>
        <Route path="/contact" element={<ContactPage />}/>
      </Routes>
  );
}

export default App;
