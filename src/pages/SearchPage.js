import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

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
                        `${API_URL}/api/users/search?q=${encodeURIComponent(query)}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await res.json();

                    if (Array.isArray(data)) {
                        setResults(data);
                    } else if (data.users && Array.isArray(data.users)) {
                        setResults(data.users);
                    } else {
                        setResults([]);
                    }

                } catch (err) {
                    console.error("Search error:", err);
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
            const res = await fetch(`${API_URL}/api/friendRequest/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ to: receiverId }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Friend request sent!");
            } else {
                alert(data.message || "Failed to send request");
            }

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setSending(null);
        }
    };

    if (!query) return <p>No search query provided.</p>;
    if (loading) return <p>Loading results...</p>;

    return (
        <div className="search-container">
            <h2>Search Results for "{query}"</h2>

            {results.length === 0 ? (
                <p>No users found.</p>
            ) : (
                results.map((resultUser) => (
                    <div key={resultUser._id} className="user-card">
                        <div className="user-info">
                            <img
                                src={resultUser.profileImage || "https://via.placeholder.com/40"}
                                alt={resultUser.name}
                                width="40"
                            />
                            <div>
                                <h3>{resultUser.name}</h3>
                                <p>{resultUser.email}</p>
                            </div>
                        </div>

                        <button
                            disabled={sending === resultUser._id}
                            onClick={() => handleAddFriend(resultUser._id)}
                        >
                            {sending === resultUser._id ? "Sending..." : "Add Friend"}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchPage;
