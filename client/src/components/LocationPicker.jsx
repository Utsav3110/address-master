import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import LocationPermissionModal from './LocationPermissionModal';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationPicker = () => {
  const [position, setPosition] = useState([19.076, 72.8777]);
  const [addressType, setAddressType] = useState(''); // For address type
  const [address, setAddress] = useState({
    name: '',
    details: '',
  });
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch address based on coordinates
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
        );
        const data = await res.json();
        setAddress({
          name: data.name || data.address.road || 'Location',
          details: data.display_name || 'Address not found',
        });
      } catch (error) {
        console.error('Error fetching address:', error);
        setAddress({
          name: 'Error fetching location',
          details: 'Please try again',
        });
      }
    };

    fetchAddress();
  }, [position]);

  const locateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const { latitude, longitude } = location.coords;
        setPosition([latitude, longitude]);
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 16);
        }
      },
      (error) => {
        alert('Unable to retrieve your location');
        console.error('Geolocation error:', error);
      }
    );
  };

  const onSaveHandler = async () => {
    try {
      // Prepare data for the POST request

      if (addressType == '') {
        toast.error('address type is required');
        return;
      }

      const payload = {
        address: address.details,
        addressType,
        coordinates: { latitude: position[0], longitude: position[1] },
      };

      console.log(payload);

      // Send data to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/add/`,
        payload
      );
      console.log(response.data);
      console.log('Address saved successfully:', response.data);
      toast.success('Address saved successfully');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Locate Me Button */}
        <div className="p-4 bg-red-500 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">
            Location Information
          </h2>
        </div>

        {/* Map */}
        <div className="relative">
          <MapContainer
            center={position}
            zoom={16}
            scrollWheelZoom
            style={{ height: '400px', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: (e) => {
                  const marker = e.target;
                  const newCoords = marker.getLatLng();
                  setPosition([newCoords.lat, newCoords.lng]);
                },
              }}
            >
              <Popup className="bg-red-600 text-white">
                <div className="text-center">
                  Your order will be delivered here
                  <br />
                  Move pin to your exact location
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <button
          onClick={locateUser}
          className="text-white bg-red-500 font-medium px-4 py-2 rounded hover:bg-gray-100 m-2"
        >
          Locate Me
        </button>

        {/* Address and Action Buttons */}
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-base mb-2">Selected Delivery Location</h3>
            <div className="flex items-start gap-3">
              <MapPin className="text-red-500 mt-1" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{address.name}</h4>
                <p className="text-sm text-gray-600">{address.details}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="addressType"
              className="text-sm font-medium text-gray-700"
            >
              Address Type
            </label>
            <select
              id="addressType"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="home">Home</option>
              <option value="Work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-between gap-4">
            <button className="flex-1 bg-white border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 text-sm">
              Enable
            </button>
            <button
              onClick={onSaveHandler}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocationPicker;
