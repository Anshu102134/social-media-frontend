import React, { useEffect, useState } from "react";

const FriendInbox = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(null); // track request being processed

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    // Fetch pending friend requests
    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/friendRequest/inbox`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (res.ok) {
                    setRequests(data); // backend returns array
                } else {
                    alert(data.message || "Failed to fetch requests");
                }
            } catch (err) {
                console.error("Error fetching requests:", err);
                alert("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [API_URL]);

    // Accept or cancel a request
    const handleRequest = async (type, requestId) => {
        setProcessing(requestId);
        try {
            const token = localStorage.getItem("token");
            const endpoint =
                type === "accept"
                    ? `${API_URL}/api/friendRequest/accept`
                    : `${API_URL}/api/friendRequest/cancel`;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ from_id: requestId }),
            });

            const data = await res.json();
            if (res.ok) {
                // remove processed request from list
                setRequests((prev) => prev.filter((r) => r.from?._id !== requestId));
            } else {
                alert(data.message || `Failed to ${type} request`);
            }
        } catch (err) {
            console.error(`Error ${type} request:`, err);
            alert("Something went wrong");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <p>Loading friend requests...</p>;
    if (requests.length === 0) return <p>No pending friend requests.</p>;

    return (
        <div style={{ maxWidth: "500px", margin: "20px auto" }}>
            <h2 style={{ textAlign: "center" }}>Friend Requests</h2>
            {requests.map((req) => (
                <div
                    key={req._id}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid #ccc",
                        padding: "10px",
                        borderRadius: "10px",
                        marginBottom: "10px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img
                            src={req.from.profileImage || "https://via.placeholder.com/40"}
                            alt={req.from.name}
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />
                        <span>{req.from.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                        <button
                            onClick={() => handleRequest("accept", req.from._id)}
                            disabled={processing === req.from._id}
                        >
                            {processing === req.from._id ? "Processing..." : "Accept"}
                        </button>
                        <button
                            onClick={() => handleRequest("cancel", req.from._id)}
                            disabled={processing === req.from._id}
                            style={{ background: "#f44336", color: "#fff" }}
                        >
                            {processing === req.from._id ? "Processing..." : "Cancel"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FriendInbox;