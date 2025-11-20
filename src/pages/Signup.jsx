import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();
  const { register, error, clearError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    
    try {
      const { email, password, name } = formValues;
      const result = await register({ email, password, name });
      
      if (result.success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container $showPassword={showPassword}>
      <BackgroundImage />
      <div className="content">
        <Header login={true} />
        <div className="body flex column a-center j-center">
          <div className="text flex column">
            <h1>Unlimited movies, TV shows and more</h1>
            <h4>Watch anywhere. Cancel anytime.</h4>
            <h6>
              Ready to watch? Enter your email to create or restart membership
            </h6>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form">
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
            {showPassword && (
              <>
                <input
                  type="text"
                  placeholder="Full Name (optional)"
                  name="name"
                  value={formValues.name}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [e.target.name]: e.target.value,
                    })
                  }
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formValues.password}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </>
            )}
            {!showPassword && (
              <button 
                onClick={() => setShowPassword(true)}
                disabled={isLoading}
              >
                Get Started
              </button>
            )}
          </div>
          {showPassword && (
            <button 
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;

  .body {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    z-index: 1;
  }
  .form {
    display: grid;
    grid-template-columns: ${({ showPassword }) =>
      showPassword ? "1fr 1fr" : "2fr 1fr"};
    margin-top: 1rem;
    gap: 0.5rem;
  }
  input {
    padding: 0.8rem;
    font-size: 1rem;
  }
  button {
    padding: 0.8rem 1.2rem;
    background-color: red;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .error-message {
    background: rgba(255, 0, 0, 0.1);
    color: #ff6b6b;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    text-align: center;
    border: 1px solid rgba(255, 0, 0, 0.3);
    max-width: 400px;
  }
`;

export default Signup;
