// src/components/Callback.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    console.log("Received authorization code:", code);

    fetch(`http://localhost:8000/api/spotify-callback/?code=${code}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Received tokens:", data);
        localStorage.setItem("spotify_access_token", data.access_token);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during token exchange:", error);
      });
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
