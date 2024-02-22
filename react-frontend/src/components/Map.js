// Map.js

import React, { useEffect, useCallback } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Box } from "@mui/material";

export default function MapContainer({ setRouteData }) {
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    version: "weekly", // Specify the version of Google Maps API
    scriptLoading: "async", // Load the script asynchronously
  });

  const handleSelectCoord = useCallback(
    (location) => {
      const newDest = {
        latitude: location.lat,
        longitude: location.lng,
      };
      setRouteData((prevData) => [...prevData, newDest]);
    },
    [setRouteData]
  );

  // Re-renders map if need to re-mount to DOM
  useEffect(() => {
    const defaultCenter = {
      lat: 35.305,
      lng: -120.6625,
    };

    const redMarkerIcon = {
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      scaledSize: { width: 30, height: 30 },
    };

    if (isLoaded) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: defaultCenter,
        zoom: 15,
      });

      const marker = new window.google.maps.Marker({
        position: defaultCenter,
        map,
        icon: redMarkerIcon,
      });

      // Gets coordinates of right click pointer
      window.google.maps.event.addListener(map, "rightclick", (event) => {
        const clickedLatLng = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };

        // Update marker position
        marker.setPosition(clickedLatLng);

        // Add to route table
        handleSelectCoord(clickedLatLng);
      });
    }
  }, [isLoaded, handleSelectCoord]);

  if (loadError) return "Error loading Google Maps";
  if (!isLoaded) return "Loading...";

  return (
    <Box
      id="map"
      style={{ height: "620px", width: "100%", borderRadius: "5px" }}
    ></Box>
  );
}
