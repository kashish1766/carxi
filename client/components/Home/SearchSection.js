"use client";
import React, { useContext, useEffect, useState } from 'react';
import InputItem from './InputItem';
import { SourceContext } from '../../context/SourceContext';
import { DestinationContext } from '../../context/DestinationContext';
import CarListOptions from './CarListOptions';
import { useJsApiLoader } from '@react-google-maps/api';

function SearchSection() {
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);
  const [distance, setDistance] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY, // Your Google Maps API Key
    libraries: ['geometry'], // Load the 'geometry' library for distance calculations
  });

  useEffect(() => {
    if (loadError) {
      console.error('Google Maps API loading error:', loadError);
    }
  }, [loadError]);

  const calculateDistance = () => {
    if (isLoaded && source && destination && source.lat && destination.lat) {
      const dist = google.maps.geometry.spherical.computeDistanceBetween(
        { lat: parseFloat(source.lat), lng: parseFloat(source.lng) },
        { lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) }
      );

      const distanceInMiles = dist * 0.000621374; // Convert meters to miles
      console.log(distanceInMiles);
      setDistance(distanceInMiles);
    }
  };

  return (
    <div>
      <div className="p-2 md:p-6 border-[2px] rounded-xl">
        <p className="text-[20px] font-bold">Get a ride</p>
        <InputItem type="source" />
        <InputItem type="destination" />

        <button
          className="p-4 bg-black w-full mt-5 text-white rounded-lg"
          onClick={calculateDistance}
          disabled={!isLoaded || !source || !destination}
        >
          Search
        </button>
      </div>

      {distance && <CarListOptions distance={distance} />}
    </div>
  );
}

export default SearchSection;
