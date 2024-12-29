import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/userContext';
import { Trash, LogOut } from 'lucide-react';

axios.defaults.withCredentials = true;

const ProfilePage = () => {
  const { user, setUser } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/add/u/${user._id}`
        );
        setAddresses(response.data);
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      }
    };

    fetchAddresses();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/users/logout`);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/add/${addressId}`
      );
      setAddresses(addresses.filter((address) => address._id !== addressId));
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-400 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl transform transition duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Welcome, {user.username}
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Manage your profile and addresses below
        </p>

        {/* Profile Section */}
        <div className="border-b border-gray-300 pb-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Profile Information
          </h3>
          <p className="text-gray-600">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600">
            <strong>Full Name:</strong> {user.fullName}
          </p>
          <button
            onClick={handleLogout}
            className="btn bg-red-600 text-white w-full mt-4 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Address Section */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Your Addresses
        </h3>
        {addresses.length === 0 ? (
          <p className="text-gray-600 text-center">No addresses found.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="bg-gray-50 border border-gray-300 rounded-lg p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {address.addressType}
                  </p>
                  <p className="text-gray-600">{address.address}</p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="bg-red-600 text-white rounded-md px-2 py-1 text-sm flex items-center gap-1 hover:bg-red-700"
                >
                  <Trash size={14} />
                  Delete
                </button>
              </div>
            ))}
          </div>  
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
