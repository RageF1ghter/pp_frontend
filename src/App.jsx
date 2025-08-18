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
  const isLoggedIn = useSelector((state) => state.auth.status);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      const decodedJwt = jwtDecode(jwt);
      console.log("Decoded JWT:", decodedJwt);
      // updateState(decodedJwt)
      dispatch(
        login({
          userId: decodedJwt.id,
          username: decodedJwt.username,
          email: decodedJwt.email,
        })
      );
      setIsLoading(false);
    }
  }, []);

  // if (isLoading) return <div>Loading...</div>; // Show a loading screen temporarily

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex flex-col gap-20">
          <Navbar />
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
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
