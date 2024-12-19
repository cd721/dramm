import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { NavLink, useNavigate } from "react-router-dom";

import logo from '../../img/logos/dark-transparent-noText.png';

import '../shared/styles/layout.css'
import { doSignOut } from "../../firebase/FirebaseFunctions";

export const Navbar = () => {
    const { currentUser } = useContext(AuthContext);

    const navigate = useNavigate();

    return (
        <nav className="topbar">
            <ul className="topbar-links">
                {currentUser &&
                    <>
                        <li>
                            <NavLink to='/home'>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to='/places'>Places</NavLink>
                        </li>
                        <li>
                            <NavLink to="/calendar">Calendar</NavLink>
                        </li>
                        <li>
                            <NavLink to="/account">My Account</NavLink>
                        </li>
                    </>
                }
            </ul>

            <div className="topbar-logo">
                <NavLink to='/'>
                    <div>
                        <img
                            src={logo}
                        />
                    </div>
                </NavLink>
            </div>

            <div className="topbar-buttons">
                {!currentUser ? (
                    <>
                        <button 
                            className="login"
                            onClick={() => navigate('/signin')}>
                            Log in
                        </button>
                        <button 
                            className="register"
                            onClick={() => navigate('/signup')}>
                            Register
                        </button>
                    </>
                ) : (
                    <button
                        className="sign-out" 
                        onClick={async () => {
                            await doSignOut(); 
                            navigate('/');
                        }}
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </nav>
    );
};