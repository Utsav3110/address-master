import React, { useState, useEffect } from 'react';
import { Search, MapPin, Plus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

const ManualLocationSearch = ({ onLocationSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [addressType, setAddressType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 3) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchLocation = async (query) => {
    setLoading(true);
    setError('');

    // Split the search query into amenity, street, and city dynamically.
    const [amenity, street, city] = query.split(',');

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/add/search/`,
        {
          params: {
            amenity: amenity?.trim(),
            street: street?.trim(),
            city: city?.trim(),
          },
        }
      );

      console.log(response.data);

      setSearchResults(response.data);
    } catch (err) {
      console.error('Error searching location:', err);
      setError('Failed to fetch search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSearchResults([]);
    setSearchQuery(location.display_name);
  };

  const saveAddress = async () => {
    if (!selectedLocation) return;

    if (addressType == '') {
      toast.error('address type is required');
      return;
    }

    try {
      const payload = {
        address: selectedLocation.display_name,
        addressType,
        coordinates: {
          latitude: parseFloat(selectedLocation.lat),
          longitude: parseFloat(selectedLocation.lon),
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/add/`,
        payload
      );

      console.log(response);

      console.log(response.status);

      if (response.status == 201) {
        toast.success('Address added successfully');
      }
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save the address. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-md shadow-lg p-6">
        <div className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold">Search Location</h2>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter amenity, street, city"
              className="w-full px-4 py-2 border rounded-lg pl-10"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>

          {loading && (
            <div className="text-center text-gray-600">Searching...</div>
          )}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto border rounded-lg">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleLocationSelect(result)}
                  className="p-2 hover:bg-gray-100 cursor-pointer flex items-start gap-2"
                >
                  <MapPin className="text-red-500 mt-1" size={16} />
                  <span className="text-sm">{result.display_name}</span>
                </div>
              ))}
            </div>
          )}

          {selectedLocation && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Friends & Family">Friends & Family</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                onClick={saveAddress}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Save Address
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full border border-red-600 text-red-600 py-2 rounded-lg hover:bg-red-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualLocationSearch;
