import React from "react";

const UserContext = React.createContext({ email: "", auth: false });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({ email: "", auth: false });

  const loginContext = (email, token) => {
    setUser((user) => ({
      email: email,
      auth: true,
    }));
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  };

  const loginContextAdmin = (email) => {
    setUser((user) => ({
      email: email,
      auth: true,
    }));
    localStorage.setItem("email", email);
  };

  const loginContextUser = (email) => {
    setUser((user) => ({
      email: email,
      auth: true,
    }));
    localStorage.setItem("email", email);
  };

  const logoutContextAdmin = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setUser((user) => ({
      email: "",
      auth: false,
    }));
  };

  const logoutContextUser = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setUser((user) => ({
      email: "",
      auth: false,
    }));
  };

  const logoutContext = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setUser((user) => ({
      email: "",
      auth: false,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginContext,
        logoutContext,
        loginContextAdmin,
        logoutContextAdmin,
        loginContextUser,
        logoutContextUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
