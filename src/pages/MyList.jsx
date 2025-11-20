import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CardSlider from "../components/CardSlider";
import { fetchMyList, addToMyList, removeFromMyList } from "../store/myListSlice";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function MyList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: myList, loading, error } = useSelector((state) => state.myList);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyList());
    }
  }, [dispatch, isAuthenticated]);

  const handleAddToList = (movie) => {
    dispatch(addToMyList(movie._id || movie.id));
  };

  const handleRemoveFromList = (movie) => {
    dispatch(removeFromMyList(movie._id || movie.id));
  };

  const handleRetry = () => {
    dispatch(fetchMyList());
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (authLoading) {
    return (
      <Container>
        <Navbar isscrolled={true} />
        <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
          <p>Checking authentication...</p>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container>
      <Navbar isscrolled={true} />

      <ContentWrapper>
        <Header>
          <h1>My List</h1>
          <p>{myList.length} {myList.length === 1 ? "movie" : "movies"}</p>
        </Header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
            <p>Loading your list...</p>
          </div>
        ) : error ? (
          <ErrorState>
            <h2>Error loading your list</h2>
            <p>{error}</p>
            <div>
              <button onClick={handleRetry}>Try Again</button>
            </div>
          </ErrorState>
        ) : myList.length === 0 ? (
          <EmptyState>
            <h2>Your list is empty</h2>
            <p>Movies and shows you add will appear here.</p>
            <button onClick={() => navigate('/')}>Browse Movies</button>
          </EmptyState>
        ) : (
          <CardSlider 
            movies={myList.map(item => item.movie)} 
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
          />
        )}
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
  color: white;
`;

const ContentWrapper = styled.div`
  padding: 100px 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  h1 { font-size: 2.5rem; margin: 0; }
  p { color: #b3b3b3; }
`;

const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
  h2 { font-size: 2rem; }
  p { color: #b3b3b3; margin: 10px 0 20px 0; }
  button {
    padding: 10px 20px;
    background: #e50914;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
  }
`;

const ErrorState = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
  h2 { 
    font-size: 2rem; 
    color: #ff6b6b;
  }
  p { 
    color: #b3b3b3; 
    margin: 10px 0 20px 0; 
  }
  button {
    padding: 10px 20px;
    background: #e50914;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    
    &:hover {
      background: #f40612;
    }
  }
`;