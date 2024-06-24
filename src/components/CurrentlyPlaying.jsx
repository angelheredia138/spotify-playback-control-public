import React, { useEffect, useState, useRef } from "react";
import { Box, Text, Image, VStack } from "@chakra-ui/react";
import ColorThief from "colorthief";
import "./CurrentlyPlaying.css"; // Ensure this file is imported

function CurrentlyPlaying() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("white");
  const imgRef = useRef(null);

  useEffect(() => {
    const fetchCurrentlyPlaying = () => {
      fetch("http://localhost:8000/api/currently-playing/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "spotify_access_token"
          )}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.item) {
            const track = {
              title: data.item.name,
              artist: data.item.artists.map((artist) => artist.name).join(", "),
              albumArt: data.item.album.images[0].url,
            };
            setCurrentlyPlaying(track);
          }
        });
    };

    fetchCurrentlyPlaying();
    const interval = setInterval(fetchCurrentlyPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentlyPlaying && imgRef.current) {
      const img = imgRef.current;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const result = colorThief.getColor(img);
          const color = `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
          console.log(`Dominant color extracted: ${color}`);
          setBgColor(color);
          setTextColor(getTextColor(result));
        } catch (error) {
          console.error("Error extracting color:", error);
        }
      };
      img.onerror = (error) => {
        console.error("Error loading image:", error);
      };
    }
  }, [currentlyPlaying]);

  const getTextColor = (rgbArray) => {
    const brightness =
      (rgbArray[0] * 299 + rgbArray[1] * 587 + rgbArray[2] * 114) / 1000;
    return brightness > 155 ? "black" : "white";
  };

  if (!currentlyPlaying) {
    return null;
  }

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <Box
      bg={bgColor}
      color={textColor}
      p={4}
      borderRadius="md"
      boxShadow="0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.25)"
      width="100%"
      maxWidth="500px"
      height="195px" // Set a fixed height
    >
      <VStack>
        <img
          ref={imgRef}
          src={currentlyPlaying.albumArt}
          alt="Album Art"
          style={{ display: "none" }}
        />
        <Box
          border="2px solid"
          borderColor={textColor}
          borderRadius="md"
          boxShadow="0 8px 16px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.25)"
          display="inline-block"
        >
          <Image
            src={currentlyPlaying.albumArt}
            alt="Album Art"
            boxSize="100px"
            borderRadius="md"
          />
        </Box>
        <Box width="100%" overflow="hidden">
          <Text fontSize="lg" fontWeight="bold" className="scrolling-text">
            {truncateText(currentlyPlaying.title, 30)}
          </Text>
        </Box>
        <Box width="100%" overflow="hidden">
          <Text fontSize="md" className="scrolling-text">
            {truncateText(currentlyPlaying.artist, 30)}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default CurrentlyPlaying;
