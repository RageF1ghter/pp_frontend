import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, guestLogin } from "@/redux/authSlice";
import config from "@/components/config";
import useAxios from "@/lib/useAxios";
import { useThrottle } from "@/lib/useThrottle";

const Login = () => {
	const prefix = config.prod.API_URL;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	// Manual axios (won't fire until we call refetch)
	const { loading, error, refetch } = useAxios(
		{
			url: `${prefix}/auth/login`,
			method: "POST",
			// you can pass initial data or override at call-time
		},
		{ auto: false, withAuth: false }
	);

	// Throttled submit → calls API → handles success/err right here
	const throttledLogin = useThrottle(async () => {
		setErrorMsg("");
		try {
			console.log(email, password);
			const res = await refetch({ data: { email, password } });
			// res is your API payload (because useAxios returns res.data)
			// Adjust the fields below to match your backend response
			const { user, jwt_token } = res;

			// Persist token & update store
			localStorage.setItem("jwt", jwt_token);
			dispatch(
				login({
					userId: user._id,
					username: user.username,
					email: user.email,
				})
			);

			// Navigate after success (by id or username—your choice)
			navigate(`/home/${user._id}`);
		} catch (err) {
			// Axios error shape: err.response?.status, err.response?.data
			const apiMsg = err?.response?.data?.message;
			setErrorMsg(apiMsg || "Login Failed, check password or try Guest login");
			// nothing else to do; UI will show the message below
		}
	}, 2000);

	const handleGuestLogin = () => {
		dispatch(guestLogin());
		navigate("/home/guest");
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				throttledLogin();
			}}
			className="flex flex-col gap-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                 bg-white border border-black shadow-lg p-6 rounded-xl w-96"
		>
			<h2 className="text-2xl font-bold text-center text-black">Login</h2>

			<label htmlFor="email" className="text-sm font-medium text-black">
				Email
			</label>
			<input
				id="email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
				autoComplete="username"
				required
			/>

			<label htmlFor="password" className="text-sm font-medium text-black">
				Password
			</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="w-full px-3 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
				autoComplete="current-password"
				required
			/>

			<button
				type="submit"
				disabled={loading}
				className={`w-full py-2 mt-2 rounded-lg font-semibold uppercase tracking-wide transition-colors
          ${
						loading
							? "bg-gray-400 text-white"
							: "bg-black text-white hover:bg-white hover:text-black hover:border hover:border-black"
					}`}
			>
				{loading ? "Logging in..." : "Login"}
			</button>

			{(error || errorMsg) && (
				<p className="text-red-600 font-light">
					{errorMsg || "Login Failed, check password or try Guest login"}
				</p>
			)}

			<button
				type="button"
				onClick={handleGuestLogin}
				className="w-full py-2 mt-2 bg-white border border-black text-black rounded-lg font-semibold uppercase tracking-wide"
			>
				Guest
			</button>
		</form>
	);
};

export default Login;
