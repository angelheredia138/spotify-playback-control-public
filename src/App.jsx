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
  { name: "Ocean Blue", value: "linear-gradient(45deg, #00c6ff, #0072ff)" },
  { name: "Purple Dream", value: "linear-gradient(45deg, #a18cd1, #fbc2eb)" },
  { name: "Mint", value: "linear-gradient(45deg, #00c9ff, #92fe9d)" },
  { name: "Peach", value: "linear-gradient(45deg, #ff9a8b, #ff6a88)" },
  { name: "Neon", value: "linear-gradient(45deg, #cc2b5e, #753a88)" },
  { name: "Aqua", value: "linear-gradient(45deg, #13547a, #80d0c7)" },
  { name: "Sunrise", value: "linear-gradient(45deg, #ff512f, #f09819)" },
  { name: "Monochrome", value: "linear-gradient(45deg, #667db6, #0082c8)" },
  { name: "Modern", value: "linear-gradient(45deg, #ff9a9e, #fad0c4)" },
  { name: "Blush", value: "linear-gradient(45deg, #ff9a8b, #ff6a88)" },
  { name: "Pastel", value: "linear-gradient(45deg, #d9a7c7, #fffcdc)" },
  { name: "Calm", value: "linear-gradient(45deg, #c1dfc4, #deecdd)" },
  { name: "Sunset", value: "linear-gradient(45deg, #f9d423, #ff4e50)" },
  { name: "Fresh", value: "linear-gradient(45deg, #b3ffab, #12fff7)" },
  { name: "Sweet", value: "linear-gradient(45deg, #ff9a9e, #ffdde1)" },
  { name: "Vivid", value: "linear-gradient(45deg, #fc354c, #0abfbc)" },
  { name: "Cool", value: "linear-gradient(45deg, #fc466b, #3f5efb)" },
  { name: "Rainbow", value: "linear-gradient(45deg, #00d2ff, #3a7bd5)" },
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
