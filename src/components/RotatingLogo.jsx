// src/components/RotatingLogo.jsx
import React from "react";
import { Box, Image, keyframes, Text } from "@chakra-ui/react";
import logo from "../assets/spotify-logo.svg";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

function RotatingLogo() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mb={4}
    >
      <Box
        as="div"
        animation={`${spin} infinite 20s linear`}
        display="flex"
        justifyContent="center"
        alignItems="center"
        background="none" // Remove background
      >
        <Image
          src={logo}
          alt="Spotify Logo"
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.25)"
          borderRadius="full"
          background={"#1ED660"}
          width="100px"
        />
      </Box>
      <Text
        mt={2}
        fontSize="lg"
        fontWeight="bold"
        color="black"
        textAlign="center"
      >
        Spotify Playback Controller
      </Text>
    </Box>
  );
}

export default RotatingLogo;
