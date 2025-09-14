// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../../redux/authSlice";
import { Menu, X } from "lucide-react";

const Navbar = () => {
	// const isLoggedIn = useSelector((state) => state.auth.status);
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const navLinks = [
		{ to: "/home", label: "Home" },
		{ to: "/spend", label: "Spends" },
		{ to: "/calendar", label: "Workout" },
		{ to: "/jobs", label: "Jobs" },
		{ to: "/heatmap", label: "Heatmap" },
		{ to: "/playground", label: "Playground" },
		{ to: "/notes", label: "Notes" },
	];

	const handleLogout = () => {
		localStorage.removeItem("jwt");
		localStorage.removeItem("detailsId");
		localStorage.removeItem("recordId");
		dispatch(logout());
		navigate("/login");
	};

	const NavButton = ({ to, children }) => (
		<Link
			to={to}
			onClick={() => setOpen(false)}
			className="font-semibold hover:text-amber-200 px-2 py-1"
		>
			{children}
		</Link>
	);

	return (
		<nav className="fixed w-full top-0 z-50 bg-black text-white">
			{/* Top bar */}
			<div className="mx-auto max-w-screen-xl px-4">
				<div className="flex h-14 items-center">
					{/* Brand / Left */}
					<Link to="/home" className="font-bold tracking-wide">
						MyApp
					</Link>

					{/* Desktop nav (md and up) */}
					<ul className="hidden md:flex md:items-center md:gap-6 ml-6">
						{navLinks.map((link) => (
							<li key={link.to}>
								<NavButton to={link.to}>{link.label}</NavButton>
							</li>
						))}
						<li className="font-semibold px-2 py-1">More...</li>
					</ul>

					{/* Spacer */}
					<div className="ml-auto" />

					{/* Desktop Logout */}
					<button
						onClick={handleLogout}
						className="hidden md:inline-block font-semibold hover:text-amber-200 px-2 py-1"
					>
						Logout
					</button>

					{/* Mobile menu toggle */}
					<button
						className="md:hidden inline-flex items-center justify-center p-2"
						aria-label="Toggle menu"
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
					>
						{open ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>
			</div>

			{/* Mobile dropdown */}
			<div className={`md:hidden ${open ? "block" : "hidden"}`}>
				<ul className="flex flex-col gap-2 px-4 pb-4">
					{navLinks.map((link) => (
						<li key={link.to}>
							<NavButton to={link.to}>{link.label}</NavButton>
						</li>
					))}
					<li className="font-semibold px-2 py-1">More...</li>
					<li>
						<button
							onClick={() => {
								setOpen(false);
								handleLogout();
							}}
							className="font-semibold hover:text-amber-200 px-2 py-1"
						>
							Logout
						</button>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
