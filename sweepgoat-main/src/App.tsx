import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from "./pages/LoginPage.tsx";
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import {Routes, Route} from "react-router-dom";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/verify-email" element={<VerifyEmailPage />}/>
        <Route path="/login" element={<LoginPage />}/>
      </Routes>
  );
}

export default App;
