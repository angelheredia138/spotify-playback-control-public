import React from "react";
import { Center, VStack, Button, Box } from "@chakra-ui/react";
import RotatingLogo from "./RotatingLogo";

const CLIENT_ID = "your_client_id";
const REDIRECT_URI = "http://localhost:5173/callback";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "code";
const SCOPE = "user-modify-playback-state user-read-playback-state";

function SpotifyAuth() {
  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
  };

  return (
    <Center h="100vh">
      <VStack spacing={8}>
        <RotatingLogo />
        <Box>
          <Button
            onClick={handleLogin}
            colorScheme="teal"
            size="lg"
            boxShadow="0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.25)"
          >
            Login to Spotify
          </Button>
        </Box>
      </VStack>
    </Center>
  );
}

export default SpotifyAuth;
