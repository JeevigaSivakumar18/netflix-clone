import React from "react";
import styled from "styled-components";
import profilePic from "../assets/profile.png"; // fallback avatar
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";

function Profile() {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Updating profile...' });
    const result = await updateProfile({ name: name || undefined, avatar: avatar || undefined });

    if (result.success) {
      setStatus({ type: 'success', message: 'Profile updated' });
      setEditMode(false);
    } else {
      setStatus({ type: 'error', message: result.error || 'Update failed' });
    }
    setTimeout(() => setStatus(null), 2500);
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Guest User';

  return (
    <Container>
      <div className="card">
      <a href="/" className="home-link">←</a>
        <img src={user?.avatar || profilePic} alt="User Profile" className="avatar" />
        <h2>{displayName}</h2>
        <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
        <p><strong>Last Login:</strong> {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
        <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>

        {!editMode ? (
          <div className="actions">
            <button className="btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        ) : (
          <form className="edit-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Display name" />
            </label>

            <label>
              Avatar URL
              <input value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://... or leave empty" />
            </label>

            <div className="actions">
              <button type="submit" className="btn primary">Save</button>
              <button type="button" className="btn" onClick={() => { setEditMode(false); setStatus(null); }}>Cancel</button>
            </div>
          </form>
        )}

        {status && <div className={`status ${status.type}`}>{status.message}</div>}
      </div>
    </Container>
  );
}

export default Profile;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #000000 0%,
    #141414 25%,
    #1a1a1a 50%,
    #141414 75%,
    #000000 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(229, 9, 20, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(229, 9, 20, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }

  .card {
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(20px);
    padding: 50px 40px;
    border-radius: 16px;
    text-align: center;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(229, 9, 20, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    width: 450px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    margin-top: 40px; /* Added space for the home link */
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #e50914, #b8070f, #e50914);
    background-size: 200% 100%;
    animation: shimmer 3s ease-in-out infinite;
  }

  .card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 
      0 20px 40px rgba(229, 9, 20, 0.3),
      0 0 0 1px rgba(229, 9, 20, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .avatar {
    width: 140px;
    height: 140px;
    border-radius: 12px;
    margin-bottom: 25px;
    object-fit: cover;
    border: 4px solid #e50914;
    box-shadow: 
      0 8px 25px rgba(229, 9, 20, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.1);
    position: relative;
    transition: all 0.3s ease;
  }

  .avatar:hover {
    transform: scale(1.05);
    box-shadow: 
      0 12px 35px rgba(229, 9, 20, 0.6),
      0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  h2 {
    margin-bottom: 15px;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 10px rgba(229, 9, 20, 0.3);
  }

  p {
    font-size: 16px;
    color: #b3b3b3;
    margin: 12px 0;
    padding: 12px 20px;
    background: rgba(45, 45, 45, 0.6);
    border-radius: 8px;
    border-left: 3px solid #e50914;
    text-align: left;
    transition: all 0.3s ease;
  }

  p:hover {
    background: rgba(60, 60, 60, 0.8);
    transform: translateX(5px);
  }

  p strong {
    color: #ffffff;
    font-weight: 600;
    display: inline-block;
    min-width: 120px;
  }

  .btn {
    padding: 14px 28px;
    margin: 8px 10px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #333333, #444444);
    color: white;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .btn:hover::before {
    left: 100%;
  }

  .btn:hover {
    background: linear-gradient(135deg, #e50914, #f6121d);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
  }

  .btn.primary {
    background: linear-gradient(135deg, #e50914, #b8070f);
    box-shadow: 0 4px 15px rgba(229, 9, 20, 0.4);
  }

  .btn.primary:hover {
    background: linear-gradient(135deg, #f6121d, #e50914);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.6);
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 25px;
    text-align: left;
    padding: 25px;
    background: rgba(30, 30, 30, 0.8);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .edit-form label {
    font-size: 14px;
    color: #e0e0e0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .edit-form input {
    padding: 14px 16px;
    background: rgba(20, 20, 20, 0.9);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .edit-form input:focus {
    border-color: #e50914;
    outline: none;
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(229, 9, 20, 0.2);
    background: rgba(25, 25, 25, 0.9);
  }

  .edit-form input::placeholder {
    color: #666;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 15px;
    justify-content: center;
  }

  .status {
    margin-top: 25px;
    padding: 16px 20px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    border: 1px solid transparent;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  }

  .status.loading {
    background: linear-gradient(135deg, #333333, #444444);
    color: #ddd;
    border-color: #555;
  }

  .status.success {
    background: linear-gradient(135deg, #0f5132, #157347);
    color: #d1e7dd;
    border-color: #198754;
  }

  .status.error {
    background: linear-gradient(135deg, #842029, #c02b3b);
    color: #f8d7da;
    border-color: #dc3545;
  }

  .home-link {
    position: absolute;
    top: 30px;
    left: 30px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #e50914;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    padding: 12px 24px;
    border-radius: 8px;
    background: rgba(20, 20, 20, 0.9);
    border: 1px solid rgba(229, 9, 20, 0.4);
    backdrop-filter: blur(10px);
    z-index: 10;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .home-link:hover {
    color: #ffffff;
    background: rgba(229, 9, 20, 0.9);
    transform: translateX(-5px);
    text-decoration: none;
    box-shadow: 0 6px 20px rgba(229, 9, 20, 0.5);
    border-color: rgba(229, 9, 20, 0.8);
  }

  @keyframes shimmer {
    0%, 100% { background-position: -200% 0; }
    50% { background-position: 200% 0; }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive design */
  @media (max-width: 480px) {
    .card {
      width: 90%;
      padding: 30px 20px;
      margin: 60px 20px 20px 20px;
    }
    
    .home-link {
      top: 20px;
      left: 20px;
      padding: 10px 16px;
      font-size: 14px;
    }
    
    .avatar {
      width: 120px;
      height: 120px;
    }
    
    h2 {
      font-size: 24px;
    }
    
    .actions {
      flex-direction: column;
      gap: 10px;
    }
    
    .btn {
      width: 100%;
      margin: 5px 0;
    }
  }
`;