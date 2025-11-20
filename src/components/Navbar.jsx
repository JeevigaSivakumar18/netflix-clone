import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../contexts/AuthContext";

function Navbar({ isScrolled }) {
  const links = [
    { name: "Home", link: "/" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
    { name: "Feeling Lucky", link: "/feeling-lucky" },
    { name: "Games", link: "/games" },
    { name: "Profile", link: "/profile" },

  ];

  const navigate = useNavigate();
  const { logout } = useAuth();
  const [toast, setToast] = useState(null);

  return (
    <Container isscrolled={isScrolled}>
      <nav className={`flex ${isScrolled ? "scrolled" : ""}`}>
        <div className="left">
          <div className="brand">
            <img src={logo} alt="Netflix Logo" />
          </div>
          <ul className="links">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="right">
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>

        {toast && (
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        )}
      </nav>
    </Container>
  );
}

export default Navbar;


const Container = styled.div`
  nav {
    position: fixed;
    top: 0;
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3rem;
    z-index: 10;
    box-sizing: border-box;
    transition: background-color 0.3s ease-in-out;
    background: ${(props) =>
      props.isScrolled ? "rgba(0,0,0,0.9)" : "transparent"};
    background-image: ${(props) =>
      props.isScrolled
        ? "none"
        : "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 40px;
    flex: 1;
  }

  .brand img {
    height: 32px;
  }

  .links {
    display: flex;
    gap: 28px;

    li a {
      color: #e5e5e5;
      font-size: 16px;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        color: #b3b3b3;
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    min-width: 120px;
    margin-left: auto;
  }

  .logout-btn {
    background: #e50914;
    border: none;
    color: white;
    cursor: pointer;
    padding: 8px 16px;
    font-size: 15px;
    border-radius: 4px;
    font-weight: bold;
    transition: 0.3s;

    &:hover {
      background: #f6121d;
    }
  }

  .toast {
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 4px;
    color: white;
    z-index: 1000;

    &.success {
      background: #2ecc71;
    }

    &.error {
      background: #e74c3c;
    }
  }
`;
