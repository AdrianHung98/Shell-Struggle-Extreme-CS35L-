import "./app.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./authentication/login";
import Register from "./authentication/register";
import Reset from "./authentication/reset";
import Dashboard from "./authentication/dashboard";
function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;