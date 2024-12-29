import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the current user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/users/current-user`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/users/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error.response?.data || error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
