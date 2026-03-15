import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (inputs) => {
    const res = await axios.post(
      "http://localhost:5000/server/auth/login",
      inputs,
      { withCredentials: true }
    );
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post("http://localhost:5000/server/auth/logout", null, {
      withCredentials: true,
    });
    localStorage.removeItem("user");
    setCurrentUser(null);
  };
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};



// we use const {login} = useContext(AuthContext) to call function in other code file 
// and const {currentUser} = useContext(AuthContext) to get current user
//currentUser.name getting user username