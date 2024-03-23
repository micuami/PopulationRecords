import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../../context';
import './Navbar.css';

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(LoggedInContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      {isLoggedIn ? (
        <ul className="navbar">
          <li><Link to='/person'>Persons</Link></li>
          <li><Link to='/penalty'>Penalties</Link></li>
          <li><Link to='/city'>Cities</Link></li>
          <li><Link onClick={handleLogout}>Logout</Link></li>
        </ul>
      ) : (
        <ul className="navbar">
          <li><Link to="/">Home</Link></li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
