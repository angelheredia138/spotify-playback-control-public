import React, { useEffect, useState } from "react";
import PlayerControls from "./components/PlayerControls";
import VolumeControl from "./components/VolumeControl";
import RotatingLogo from "./components/RotatingLogo";
import SpotifyAuth from "./components/SpotifyAuth";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import Logout from "./components/Logout";
import { Center, VStack, HStack, Box } from "@chakra-ui/react";
import "./styles/GradientBackground.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  const handleOrientationChange = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  };

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setIsAuthenticated(true);
    }

    // Define the gradient backgrounds
    const gradients = [
      "linear-gradient(45deg, #00c6ff, #0072ff, #00c6ff, #0072ff, #00c6ff, #0072ff)", // Ocean Blue
      "linear-gradient(45deg, #a18cd1, #fbc2eb, #a18cd1, #fbc2eb, #a18cd1, #fbc2eb)", // Purple Dream
      "linear-gradient(45deg, #00c9ff, #92fe9d, #00c9ff, #92fe9d, #00c9ff, #92fe9d)", // Mint
      "linear-gradient(45deg, #ff9a8b, #ff6a88, #ff99ac, #ff6a88, #ff9a8b, #ff99ac)", // Peach
      "linear-gradient(45deg, #cc2b5e, #753a88, #cc2b5e, #753a88, #cc2b5e, #753a88)", // Neon
      "linear-gradient(45deg, #13547a, #80d0c7, #13547a, #80d0c7, #13547a, #80d0c7)", // Aqua
      "linear-gradient(45deg, #ff512f, #f09819, #ff512f, #f09819, #ff512f, #f09819)", // Sunrise
    ];

    // Select a random gradient
    const randomGradient =
      gradients[Math.floor(Math.random() * gradients.length)];

    // Apply the random gradient to the background
    document.body.style.background = randomGradient;
    document.body.style.backgroundSize = "600% 600%";
    document.body.style.animation =
      "GradientBackgroundAnimation 16s ease infinite";

    // Add event listener for orientation change
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return (
    <Center h="100vh">
      {isAuthenticated ? (
        isPortrait ? (
          <VStack spacing={8}>
            <RotatingLogo />
            <PlayerControls />
            <VolumeControl />
            <CurrentlyPlaying />
            <Box mt={4}>
              <Logout />
            </Box>
          </VStack>
        ) : (
          <HStack spacing={8} alignItems="center">
            <RotatingLogo />
            <VStack spacing={10} alignItems="center">
              <PlayerControls />
              <VolumeControl />
              <CurrentlyPlaying />
              <Logout />
            </VStack>
          </HStack>
        )
      ) : (
        <SpotifyAuth />
      )}
    </Center>
  );
}

export default App;
