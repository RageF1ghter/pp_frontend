import "./navbar.css"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.auth.status);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    useEffect(() => {
        document.body.className = theme;
    },[theme]);

    return (
        <nav className={`navbar ${theme}`}>
            <ul>
                <li><Link className="nav-link" to="/home">Home</Link></li>
                {isLoggedIn && (
                    <>
                        <li><Link className="nav-link" to="/spend">Spend summary</Link></li>
                        <li><Link className="nav-link" to="/workout">Workout record</Link></li>
                        <li><Link className="nav-link" to="/heatmap">Heatmap</Link></li>
                        <li><Link className="nav-link" to="/notes">Notes</Link></li>
                        <li><Link className="nav-link" to="/playground">Playground</Link></li>
                        <li><Link className="nav-link" to="/calendar">Calendar</Link></li>
                        <li>More...</li>
                    </>
                )}
            </ul>

            {/* Theme Toggle Button */}
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
        </nav>


    )
}

export default Navbar;