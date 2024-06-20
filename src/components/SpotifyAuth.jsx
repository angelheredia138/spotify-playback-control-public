import React from "react";

const CLIENT_ID = "55ea9a06334e4a5788b109027918eaf5";
const REDIRECT_URI = "http://localhost:5173/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = "user-modify-playback-state user-read-playback-state";

function SpotifyAuth() {
  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login to Spotify</button>
    </div>
  );
}

export default SpotifyAuth;
