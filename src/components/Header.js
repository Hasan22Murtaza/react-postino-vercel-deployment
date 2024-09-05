import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const userType = localStorage.getItem("type");
  console.log("se", userInfo);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token'); 
    navigate('/auth/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <a href="#" className="sidebar-toggler">
        <i data-feather="menu"></i>
      </a>
      <div className="navbar-content">
        <ul className="list-unstyled custom-menu">
          <li className="nav-item dropdown nav-apps">
            <Link className="nav-link" to="/user/projects">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-activity"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Projects
            </Link>
            <Link className="nav-link" to="/user/collections">
              Projects Collections
            </Link>
            {userType === 'super-admin' && (
              <Link className="nav-link" to="/user/users">
                User Lists
              </Link>
            )}
          </li>
        </ul>

        <ul className="navbar-nav">
          <li className="nav-item dropdown nav-profile" ref={dropdownRef}>
            <a
              className="nav-link dropdown-toggle"
              id="profileDropdown"
              role="button"
              onClick={toggleDropdown}
            >
              <img src={userInfo?.profilePictureFullUrl} alt="profile" />
            </a>
            <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="profileDropdown">
              <div className="dropdown-header d-flex flex-column align-items-center">
                <div className="figure mb-3">
                  <img src={userInfo?.profilePictureFullUrl} alt="profile" />
                </div>
                <div className="info text-center">
                  <p className="name font-weight-bold mb-0">{userInfo?.name}</p>
                  <p className="email text-muted mb-3">{userInfo?.email}</p>
                </div>
              </div>
              <div className="dropdown-body">
                <ul className="profile-nav p-0 pt-3">
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/profile">
                      <i data-feather="repeat"></i>
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/change-password">
                      <i data-feather="edit"></i>
                      <span>Change Password</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#!"
                      onClick={handleLogout}
                    >
                      <i data-feather="log-out"></i>
                      <span>Log Out</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
