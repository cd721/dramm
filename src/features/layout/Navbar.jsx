import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { NavLink } from "react-router-dom";

import logo from '../../img/logos/dark-transparent-noText.png';
import SignOut from "../authentication/SignOut";

import '../shared/styles/layout.css'

export const Navbar = () => {
    const { currentUser } = useContext(AuthContext);

    return (
        <nav className="topbar">
            <ul className="topbar-links">
                <li>
                    <NavLink to='/'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/'>About</NavLink>
                </li>
                <li>
                    <NavLink to='/places'>Places</NavLink>
                </li>

                {currentUser &&
                    <li>
                        <NavLink to="/account">My Account</NavLink>
                    </li>
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
                    <ul className="auth-links">
                        <li>
                            <NavLink to="/signup">Sign-up</NavLink>
                        </li>
                        <li>
                            <NavLink to="/signin">Sign-In</NavLink>
                        </li>
                    </ul>
                ) : (
                    <ul className="auth-links">
                        <li>
                            <SignOut />
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};