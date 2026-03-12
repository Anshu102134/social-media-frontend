import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";


const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(null);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:5000/api/users/search?q=${encodeURIComponent(query)}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await res.json();
          if (Array.isArray(data)) setResults(data);
          else if (data.users && Array.isArray(data.users)) setResults(data.users);
          else setResults([]);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchResults();
    }
  }, [query]);

  const handleAddFriend = async (receiverId) => {
    const token = localStorage.getItem("token");
    setSending(receiverId);
    try {
      const res = await fetch("http://localhost:5000/api/friendRequest/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
       body: JSON.stringify({ to: receiverId })
      });

      const data = await res.json();
      alert(res.ok ? "Friend request sent!" : data.message || "Failed to send");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSending(null);
    }
  };

  if (!query) return <p className="text-center">No search query provided.</p>;
  if (loading) return <p className="text-center">Loading results...</p>;

  return (
    <div className="search-container">
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>
        Search Results for "{query}"
      </h2>
      {results.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>No users found.</p>
      ) : (
        results.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-info">
              <img
                src={user.profileImage || "https://via.placeholder.com/40"}
                alt={user.name}
              />
              <div>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
            </div>
            <button
              className="add-btn"
              disabled={sending === user._id}
              onClick={() => handleAddFriend(user._id)}
            >
              {sending === user._id ? "Sending..." : "Add Friend"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchPage;
