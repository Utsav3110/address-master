import React, { useState } from 'react';
import { MapPinOff, Search } from 'lucide-react';
import ManualLocationSearch from './ManualLocationSearch';
import { useNavigate } from 'react-router-dom';

const LocationPermissionModal = ({ onLocationSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const navigate = useNavigate();

  const enableLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsOpen(false);
        navigate('/location-picker');
      },
      (error) => {
        console.error('Error getting location:', error.message);
      }
    );
  };

  const handleManualLocationSelect = (coordinates) => {
    onLocationSelect(coordinates);
    setShowManualSearch(false);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {showManualSearch ? (
        <ManualLocationSearch
          onLocationSelect={handleManualLocationSelect}
          onClose={() => setShowManualSearch(false)}
        />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-md shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <MapPinOff className="text-red-600 w-16 h-16 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Location permission is off
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                We need your location to find the nearest store & provide you a
                seamless delivery experience.
              </p>
              <button
                onClick={enableLocation}
                className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg w-full mb-3 hover:bg-red-700"
              >
                Enable Location
              </button>
              <button
                onClick={() => setShowManualSearch(true)}
                className="border border-red-600 text-red-600 font-medium py-2 px-4 rounded-lg w-full flex items-center justify-center hover:bg-red-100"
              >
                <Search className="mr-2" />
                Search your Location Manually
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationPermissionModal;
