// src/components/VolumeControl.jsx
import React, { useState, useEffect } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FaVolumeUp } from "react-icons/fa";

function VolumeControl() {
  const [volume, setVolume] = useState(50);
  const accessToken = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    fetch("http://localhost:8000/api/playback-state/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.device && data.device.volume_percent !== undefined) {
          setVolume(data.device.volume_percent);
        }
      })
      .catch((error) => {
        console.error("Error fetching playback state:", error);
      });
  }, [accessToken]);

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const handleVolumeChangeEnd = (value) => {
    fetch("http://localhost:8000/api/volume/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ volume_percent: value }),
    });
  };

  return (
    <Box width="100%">
      <Slider
        aria-label="volume-slider"
        value={volume}
        onChange={handleVolumeChange}
        onChangeEnd={handleVolumeChangeEnd}
        min={0}
        max={100}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Icon as={FaVolumeUp} />
        </SliderThumb>
      </Slider>
    </Box>
  );
}

export default VolumeControl;
