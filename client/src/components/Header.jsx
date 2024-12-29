import React, { useContext } from "react";
import { UserContext } from "../contexts/userContext";
import { Link } from "react-router-dom";



const Header = () => {
  const { user } = useContext(UserContext); 
// Access user from context

  return (
  
      <header className="bg-white shadow-md">
        <nav className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-red-600">App Header</h1>
          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="btn"
                >
                  Profile
                </Link>
                <Link
                  to="/location-permission"
                  className="btn"
                >
                  Location Permission
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      
   
  );
};


export default Header;