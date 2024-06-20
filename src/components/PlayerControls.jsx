// src/components/PlayerControls.jsx
import React, { useState, useEffect } from "react";
import { Button, VStack, HStack, Select } from "@chakra-ui/react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaRedo,
  FaRandom,
} from "react-icons/fa";

function PlayerControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const accessToken = localStorage.getItem("spotify_access_token");

  useEffect(() => {
    // Fetch the playlists
    fetch("http://localhost:8000/api/playlists/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched playlists:", data);
        if (data.items) {
          setPlaylists(data.items);
        }
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error);
      });

    // Fetch the current playback state
    fetch("http://localhost:8000/api/playback-state/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.is_playing !== undefined) {
          setIsPlaying(data.is_playing);
        }
        if (data && data.shuffle_state !== undefined) {
          setIsShuffled(data.shuffle_state);
        }
      })
      .catch((error) => {
        console.error("Error fetching playback state:", error);
      });
  }, [accessToken]);

  const handlePlayPause = () => {
    if (isPlaying) {
      fetch("http://localhost:8000/api/pause/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(() => setIsPlaying(false));
    } else {
      fetch("http://localhost:8000/api/play/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(() => setIsPlaying(true));
    }
  };

  const handleSkip = () => {
    fetch("http://localhost:8000/api/skip/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const handlePrevious = () => {
    fetch("http://localhost:8000/api/previous/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const handleRestart = () => {
    fetch("http://localhost:8000/api/restart/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const handleShuffle = () => {
    const state = !isShuffled;
    fetch("http://localhost:8000/api/shuffle/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ state }),
    }).then(() => setIsShuffled(state));
  };

  const handlePlaylistChange = (e) => {
    const playlistId = e.target.value;
    fetch(`http://localhost:8000/api/play/playlist/${playlistId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  return (
    <VStack spacing={4}>
      <HStack spacing={4}>
        <Button
          colorScheme="teal"
          textColor={"black"}
          onClick={handlePrevious}
          leftIcon={<FaBackward />}
        >
          Previous
        </Button>
        <Button
          colorScheme="teal"
          textColor={"black"}
          onClick={handlePlayPause}
          leftIcon={isPlaying ? <FaPause /> : <FaPlay />}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          colorScheme="teal"
          textColor={"black"}
          onClick={handleSkip}
          leftIcon={<FaForward />}
        >
          Skip
        </Button>
      </HStack>
      <HStack spacing={4}>
        <Button
          colorScheme="teal"
          textColor={"black"}
          onClick={handleRestart}
          leftIcon={<FaRedo />}
        >
          Restart
        </Button>
        <Button
          colorScheme="teal"
          textColor={"black"}
          onClick={handleShuffle}
          leftIcon={<FaRandom />}
        >
          {isShuffled ? "Shuffled" : "Unshuffled"}
        </Button>
      </HStack>
      <Select
        focusBorderColor="teal.500"
        borderColor={"#319795"}
        background={"#319795"}
        textColor={"black"}
        fontSize="1em"
        fontWeight="semibold"
        fontFamily="inherit"
        borderRadius="8px"
        onChange={handlePlaylistChange}
      >
        {Array.isArray(playlists) &&
          playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
      </Select>
    </VStack>
  );
}

export default PlayerControls;
