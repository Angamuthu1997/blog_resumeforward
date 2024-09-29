import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const token = localStorage.getItem('token')
  useEffect(() => {
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json', 
      },
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  const username = userInfo?.username;

  return (
    <header>

      {/* <Link to="/register">Register</Link> */}
      <nav>
        <div className="header">
          {username && (
            <>
              <Link to="/" className="logo">MyBlog</Link>
              <div className="nav-links">
                <Link to="/create" className="create-post">Create post</Link>
                <Link to="/resume" className="resume">Resume</Link>
                <a onClick={logout} className="logout-link">Logout </a>
              </div>
            </>
          )}
        </div>
        {!username && (
          <>
            {/* <Navigate to="/login" replace /> */}
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {/* {!username && { window.location.href = '/login'} &&(
          <Link to="/register">Register</Link> 
        ) } */}
      </nav>
    </header>
  );
}
