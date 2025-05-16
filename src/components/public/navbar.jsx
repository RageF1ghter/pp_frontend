// import "./navbar.css"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.auth.status);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [width, setWidth] = useState(window.innerWidth);
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const threshold = 768;

    const handleResize = () => {
        setWidth(window.innerWidth);
        // console.log(width);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {
            removeEventListener('resize', handleResize)
        }
    })

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('detailsId');
        localStorage.removeItem('recordId');
        dispatch(logout());
        // setIsLoggingIn(false);
        navigate('/login');
    }

    return (
        <nav className={`navbar ${theme}`}>
            {width < threshold ?
                <div>
                    {isExpanded ? 
                        <ul className="flex flex-col fixed top-0 left-0
                         bg-black text-white w-full p-4 gap-3 rounded-b-2xl">
                            <li><Link className="hover:text-amber-200" to="/spend" onClick={() => setIsExpanded(false)}>Spends</Link></li>
                            <li><Link className="hover:text-amber-200" to="/workout" onClick={() => setIsExpanded(false)}>Workout</Link></li>
                            <li><Link className="hover:text-amber-200" to="/heatmap" onClick={() => setIsExpanded(false)}>Heatmap</Link></li>
                            {/* <li><Link className="hover:text-amber-200" to="/notes" onClick={() => setIsExpanded(false)}>Notes</Link></li> */}
                            <li><Link className="hover:text-amber-200" to="/playground" onClick={() => setIsExpanded(false)}>Playground</Link></li>
                            <li><Link className="hover:text-amber-200" to="/calendar" onClick={() => setIsExpanded(false)}>Calendar</Link></li>
                            <li><Link className="hover:text-amber-200" to="/jobs" onClick={() => setIsExpanded(false)}>Jobs</Link></li>
                            <li>More...</li>
                            <li><button className="hover:text-amber-200" onClick={() => handleLogout()}>Logout</button></li>
                            <li><button className="hover:text-blue-200" onClick={() => setIsExpanded(false)}>Collapse</button></li>

                        </ul>
                    :
                        <button 
                            className="flex flex-col fixed top-0 left-0
                            bg-black text-white w-full rounded-b-xl p-4
                            hover:text-blue-200"
                            onClick={() => setIsExpanded(true)}
                        >
                            Expand
                        </button>
                    }
                </div>
                :
                <div>
                    <ul className="fixed top-0 left-0 flex flex-row gap-5
                        p-4 bg-black text-white w-full 
                    ">
                        <li><Link className="hover:text-amber-200" to="/spend">Spends</Link></li>
                        <li><Link className="hover:text-amber-200" to="/workout">Workout</Link></li>
                        <li><Link className="hover:text-amber-200" to="/heatmap">Heatmap</Link></li>
                        {/* <li><Link className="hover:text-amber-200" to="/notes">Notes</Link></li> */}
                        <li><Link className="hover:text-amber-200" to="/playground">Playground</Link></li>
                        <li><Link className="nav-link" to="/calendar">Calendar</Link></li>
                        <li><Link className="hover:text-amber-200" to="/jobs" onClick={() => setIsExpanded(false)}>Jobs</Link></li>
                        <li>More...</li>
                        <li><button className="hover:text-amber-200" onClick={() => handleLogout()}>Logout</button></li>
                        <button className="ml-auto mr-0" onClick={toggleTheme}>
                            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                        </button>
                    </ul>

                    
                </div>
                
            }



        </nav>


    )
}

export default Navbar;