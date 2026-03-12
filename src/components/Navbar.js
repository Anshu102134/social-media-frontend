import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Search from './Search';

const Navbar = () => {
    const { user, setUser, loading } = useContext(AuthContext);

    if (loading) {
        return <nav className="navbar"><p>Loading...</p></nav>;
    }

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Clear JWT from storage
    };

    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="title">MyApp</li>

                {!user && (
                    <>
                        <li><Link to="/" className="nav-link">Register</Link></li>
                        <li><Link to="/login" className="nav-link">Login</Link></li>
                    </>
                )}

                {user && (
                    <>
                        <li><Link to="/home" className="nav-link">Home</Link></li>
                        <li><Link to="/feed" className="nav-link">Feed</Link></li>
                        <li><Link to="/friends" className="nav-link">Friends</Link></li>
                        <li><Link to="/notification" className="nav-link">Notification</Link></li>
                        <li><Search /></li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="nav-link logout-btn"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;