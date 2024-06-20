import React from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("spotify_access_token");
    navigate("/");
    window.location.reload(); // Force page reload
  };

  return (
    <Button colorScheme="red" onClick={handleLogout}>
      Log Out
    </Button>
  );
}

export default Logout;
