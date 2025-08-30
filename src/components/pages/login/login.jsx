import { useState } from "react";
import { login, guestLogin } from "../../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import config from "../../config";
import { useThrottle } from "@/lib/useThrottle";

const Login = () => {
  const prefix = config.prod.API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${prefix}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      if (!response.ok) {
        setError(true);
      }

      const data = await response.json();

      dispatch(
        login({
          userId: data.user._id,
          username: data.user.username,
          email: data.user.email,
          status: true,
        })
      );
      localStorage.setItem("jwt", data.jwt_token);

      navigate(`/home/${data.user.username}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGuestLogin = () => {
    dispatch(guestLogin());
    navigate(`/home/guest`);
  };

  const throttledLogin = useThrottle(handleLogin, 2000);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                 bg-white border border-black shadow-lg p-6 rounded-xl w-96"
    >
      <h2 className="text-2xl font-bold text-center text-black">Login</h2>

      <label htmlFor="email" className="text-sm font-medium text-black">
        Email
      </label>
      <input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
      />

      <label htmlFor="password" className="text-sm font-medium text-black">
        Password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
      />

      <button
        type="button"
        onClick={throttledLogin}
        className="w-full py-2 mt-2 bg-black text-white rounded-lg font-semibold uppercase tracking-wide hover:bg-white hover:text-black hover:border hover:border-black transition-colors"
      >
        Login
      </button>
      {error && (
        <p className="text-red-600 font-light">
          Login Failed, check password or try Guest login
        </p>
      )}
      <button
        onClick={handleGuestLogin}
        className="w-full py-2 mt-2 bg-white border border-black text-black rounded-lg font-semibold uppercase tracking-wide"
      >
        Guest
      </button>
    </form>
  );
};

export default Login;
