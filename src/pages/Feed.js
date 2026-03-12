import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Feed = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Loading...</p>;
    }

    // Redirect to login if user is not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h2>Feed</h2>
            <p>Welcome, {user.id}!</p>
            {/* TODO: Display posts or feed items here */}
        </div>
    );
};

export default Feed;