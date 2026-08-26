// src/Context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState({});
  const [admin, setAdmin] = useState(null);

  const [config, setConfig] = useState({
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  useEffect(() => {
    const controlAuth = async () => {
      try {
        const { data } = await axios.get("/auth/private", config);

        if (data.role === "admin") setAdmin(data.user);
        else setActiveUser(data.user);
      } catch (error) {
        localStorage.removeItem("authToken");
        setActiveUser({});
        setAdmin(null);
      }
    };
    controlAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        activeUser,
        setActiveUser,
        admin,
        setAdmin,
        config,
        setConfig,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
