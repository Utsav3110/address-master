import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../contexts/userContext';

axios.defaults.withCredentials = true;

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user , setUser } = useContext(UserContext);

  

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("in login");
    setLoading(true);


    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/users/login`, formData);
      console.log(response.data);
      toast.success(response.data.message);
      setUser(response.data.user)
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-400 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition duration-300 hover:shadow-xl"
      >
        <h2 className="text-3xl font-bold text-red-600 text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Please login to access your account
        </p>
        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <button
          type="submit"
          className={`btn ${loading ? 'btn-disabled' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-red-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
