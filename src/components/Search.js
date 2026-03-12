import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Search = () => {
    const [name, setName] = useState("");
    const [results, setResults] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!name.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `https://social-media-backend-xxgc.onrender.com/api/users/search?q=${encodeURIComponent(name)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Search failed");

            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
            alert("Error fetching search results");
        }
    };

    return (
        <div className="search-component">
            <input
                type="text"
                value={name}
                placeholder="Search your friend"
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            {results.length > 0 && (
                <ul className="search-results">
                    {results.map((user) => (
                        <li key={user._id}>
                            {user.name} ({user.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Search;