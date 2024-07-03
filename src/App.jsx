import React, { useEffect, useState } from "react";
import { Box, Select, Center, VStack, HStack } from "@chakra-ui/react";
import PlayerControls from "./components/PlayerControls";
import VolumeControl from "./components/VolumeControl";
import RotatingLogo from "./components/RotatingLogo";
import SpotifyAuth from "./components/SpotifyAuth";
import CurrentlyPlaying from "./components/CurrentlyPlaying";
import Logout from "./components/Logout";
import "./styles/GradientBackground.css";

const gradients = [
  { name: "Red", value: "linear-gradient(45deg, #ff0000, #8b0000)" },
  { name: "Orange", value: "linear-gradient(45deg, #ff7f00, #cc5500)" },
  { name: "Yellow", value: "linear-gradient(45deg, #ffff00, #999900)" },
  { name: "Green", value: "linear-gradient(45deg, #00ff00, #006400)" },
  { name: "Blue", value: "linear-gradient(45deg, #0000ff, #00008b)" },
  { name: "Purple", value: "linear-gradient(45deg, #800080, #4b0082)" },
  { name: "Night", value: "linear-gradient(45deg, #2c3e50, #1a242f)" },
  { name: "Day", value: "linear-gradient(45deg, #87CEFA,  #517b96)" },
  {
    name: "Rainbow",
    value:
      "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #800080, #ff0000)",
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const [background, setBackground] = useState("");

  const handleOrientationChange = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  };

  const handleBackgroundChange = (event) => {
    setBackground(event.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      setIsAuthenticated(true);
    }

    // Select a random gradient
    const randomGradient =
      gradients[Math.floor(Math.random() * gradients.length)].value;
    setBackground(randomGradient);

    // Add event listener for orientation change
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.background = background;
    document.body.style.backgroundSize = "600% 600%";
    document.body.style.animation =
      "GradientBackgroundAnimation 16s ease infinite";
  }, [background]);

  return (
    <Center h="100vh">
      {isAuthenticated ? (
        isPortrait ? (
          <VStack spacing={8}>
            <RotatingLogo />
            <Select
              placeholder="Select Background"
              onChange={handleBackgroundChange}
              value={background}
              mt={4}
              color="white"
              bg="rgba(0, 0, 0, 0.5)"
              borderRadius="md"
              borderColor="white"
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "gray.500" }}
            >
              {gradients.map((gradient) => (
                <option key={gradient.name} value={gradient.value}>
                  {gradient.name}
                </option>
              ))}
            </Select>
            <PlayerControls />
            <VolumeControl />
            <CurrentlyPlaying />
            <Box mt={4}>
              <Logout />
            </Box>
          </VStack>
        ) : (
          <VStack>
            <HStack spacing={8} alignItems="center">
              <RotatingLogo />
              <VStack spacing={10} alignItems="center">
                <PlayerControls />
                <VolumeControl />
                <Logout />
              </VStack>
            </HStack>
            <CurrentlyPlaying />
            <Select
              placeholder="Select Background"
              focusBorderColor="teal.500"
              borderColor={"#319795"}
              background={"#319795"}
              textColor={"black"}
              fontSize="1em"
              fontWeight="semibold"
              fontFamily="inherit"
              borderRadius="8px"
              onChange={handleBackgroundChange}
              value={background}
              mt={4}
              _hover={{ borderColor: "gray.500" }}
              _focus={{ borderColor: "gray.500" }}
            >
              {gradients.map((gradient) => (
                <option key={gradient.name} value={gradient.value}>
                  {gradient.name}
                </option>
              ))}
            </Select>
          </VStack>
        )
      ) : (
        <SpotifyAuth />
      )}
    </Center>
  );
}

export default App;
