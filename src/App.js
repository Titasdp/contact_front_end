import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import RegisterForm from "./components/register/registerForm";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ManageProfile from "./pages/manageProfile";
import PasswordChange from "./pages/passwordChange";
import 'bootstrap/dist/css/bootstrap.min.css';
import DashboardHome from "./pages/dashboardHome";
// import 'react-toastify'

function App() {
  return (
    <div className="bg-light">
    <Router>
      <Routes>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/contacts" element={<Dashboard />} />~
        <Route exact path="/profile" element={<ManageProfile />} />
        <Route exact path="/manage/password" element={<PasswordChange />} />
        <Route exact path="/" element={<DashboardHome />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
