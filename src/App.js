import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { LoginPage } from "./pages/LoginPage";
import Feed from "./pages/Feed";
import FriendInbox from "./pages/FriendInbox";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import RegisterForm from "./pages/Registration";
import SearchPage from "./pages/SearchPage";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>; // Prevents flicker before user is known
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* 👇 Conditional rendering */}
        <Route
          index
          element={user ? <HomePage /> : <RegisterForm />}
        />

        <Route path="login" element={<LoginPage />} />
        <Route path="feed" element={<Feed />} />
        <Route path="friends" element={<FriendInbox />} />
        <Route path="home" element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
      </Route>

      {/* fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
