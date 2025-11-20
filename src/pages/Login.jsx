import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

function Login() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuth();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    
    try {
      const { email, password } = formValues;
      const result = await login({ email, password });
      
      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <div className="overlay">
        <Header />
        <div className="form-wrapper">
          <div className="form-container">
            <div className="title">
              <h3>Login</h3>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues({ ...formValues, [e.target.name]: e.target.value })
                }
                required
                disabled={isLoading}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({ ...formValues, [e.target.name]: e.target.value })
                }
                required
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  /* BackgroundImage should cover everything */
  > *:first-child {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
  }

  .overlay {
    position: relative;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6); /* dark overlay */
    display: flex;
    flex-direction: column;
  }

  .form-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;  /* center horizontally */
    align-items: center;      /* center vertically */
  }

  .form-container {
    width: 100%;
    max-width: 400px;
    background: rgba(0, 0, 0, 0.75);
    padding: 3rem 2rem;
    border-radius: 8px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  input {
    padding: 0.9rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
  }

  button {
    padding: 0.9rem 1.2rem;
    background-color: red;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
  }

  .title h3 {
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .error-message {
    background: rgba(255, 0, 0, 0.1);
    color: #ff6b6b;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
    border: 1px solid rgba(255, 0, 0, 0.3);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default Login;
