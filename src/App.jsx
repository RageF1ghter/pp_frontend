import "./App.css";
import Navbar from "./components/public/navbar";
import Home from "./components/pages/home/home";
import Spend from "./components/pages/spend/spend";
import Login from "./components/pages/login/login";
import Heatmap from "./components/pages/heatmap/heatmap";
import Playground from "./components/pages/playground/playground";
import Calendar from "./components/pages/workout/calendar";
import Recording from "./components/pages/workout/recording";
import Details from "./components/pages/workout/details";
import Jobs from "./components/pages/jobs/jobs";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { login } from "./redux/authSlice";

function App() {
  const role = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      const decodedJwt = jwtDecode(jwt);
      // console.log("Decoded JWT:", decodedJwt);
      // updateState(decodedJwt)
      dispatch(
        login({
          userId: decodedJwt.id,
          username: decodedJwt.username,
          email: decodedJwt.email,
        })
      );
    }
  }, []);

  const RoleRoutes = () => {
    if (role === null) {
      return (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      );
    } else if (role === "guest") {
      return (
        <Routes>
          <Route path="/home/guest" element={<Home />} />
          <Route path="/playground/*" element={<Playground />} />
          <Route path="*" element={<Home />} />
        </Routes>
      );
    } else if (role === "user") {
      return (
        <Routes>
          <Route path="/home/:username" element={<Home />} />
          <Route path="/spend" element={<Spend />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/playground/*" element={<Playground />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/recording" element={<Recording />} />
          <Route path="/details/*" element={<Details />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="*" element={<Home />} />
        </Routes>
      );
    }
  };

  return (
    <Router>
      <div className="flex flex-col gap-10 pt-14">
        <Navbar />
        <RoleRoutes />
      </div>
    </Router>
  );
}

export default App;
