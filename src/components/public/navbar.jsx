// import "./navbar.css"
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.auth.status);
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


    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('detailsId');
        localStorage.removeItem('recordId');
        dispatch(logout());
        // setIsLoggingIn(false);
        navigate('/login');
    }


    const Button = ({ effect, dest, onClick, text}) => {
        if (dest) {
            return (
                <button className={effect} onClick={() => {setIsExpanded(false); navigate(dest)}}>{text}</button>
            )
        }
        return (
            <button className={effect} onClick={onClick}>{text}</button>
        )
    }

    return (
        <nav>
            {width < threshold ?
                <div>
                    
                        <ul className="flex flex-col fixed top-0 left-0
                         bg-black text-white w-full p-4 gap-3 rounded-b-2xl">
                            {isExpanded ? (
                                <div>
                                    <li><Button effect="hover:text-amber-200 p-1" dest='/home' text="Home" /></li>
                                    <li><Button effect="hover:text-amber-200 p-1" dest='/spend' text="Spends" /></li>
                                    <li><Button effect="hover:text-amber-200 p-1" dest='/calendar' text="Workout" /></li>
                                    <li><Button effect="hover:text-amber-200 p-1" dest='/jobs' text="Jobs" /></li>
                                    <li><Button effect="hover:text-amber-200 p-1" dest='/heatmap' text="Heatmap" /></li>
                                    <li><Button effect="hover:text-amber-200 p-1" dest='/playground' text="Playground" /></li>
                                    <li className="mb-5 p-1">More...</li>
                                    <li><Button effect="hover:text-amber-200 p-1" onClick={handleLogout} text="Logout"/></li>
                                    <li><Button effect="hover:text-blue-200 p-1" onClick={() => setIsExpanded(false)} text="Collapse"/></li>
                                </div>
                            )
                            :   
                                <li><Button effect="text-blue-200" onClick={() => setIsExpanded(true)} text="Expand"/></li>
                            }
                        </ul>
                    
                </div>
                :
                <div>
                    <ul className="fixed top-0 left-0 flex flex-row gap-5
                        p-4 bg-black text-white w-full 
                    ">
                        <li><Button effect="hover:text-amber-200" dest='/home' text="Home" /></li>
                        <li><Button effect="hover:text-amber-200" dest='/spend' text="Spends" /></li>
                        <li><Button effect="hover:text-amber-200" dest='/calendar' text="Workout" /></li>
                        <li><Button effect="hover:text-amber-200" dest='/jobs' text="Jobs" /></li>
                        <li><Button effect="hover:text-amber-200" dest='/heatmap' text="Heatmap" /></li>
                        <li><Button effect="hover:text-amber-200" dest='/playground' text="Playground" /></li>
                        <li className="">More...</li>
                        <li className="ml-auto mr-0"><Button effect="hover:text-amber-200 " onClick={handleLogout} text="Logout"/></li>
                        
                    </ul>
                    
                    
                </div>
                
            }



        </nav>


    )
}

export default Navbar;