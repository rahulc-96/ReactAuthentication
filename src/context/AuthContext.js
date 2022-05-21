import { createContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  login: (token) => {},
  logout: () => {},
});

let logoutTimer;

const calculateRemainingExpirationTime = (expirationTime) => {
  if(expirationTime == null)
    return 0;
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const fetchStoredTokenData = () => {
  const expirationTime = localStorage.getItem("expirationTime");
  let token = localStorage.getItem("token");
  let remainingDuration = calculateRemainingExpirationTime(expirationTime);
  if (remainingDuration <= 0) {
    token = null;
    remainingDuration = 0;
  }
  return {
    token,
    remainingDuration,
  };
};

export const AuthContextProvider = (props) => {
  let initialToken = null;
  const tokenData = fetchStoredTokenData();
  if (tokenData.token != null) {
    initialToken = tokenData.token;
  }
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialToken);
  const [token, setToken] = useState(initialToken);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    clearTimeout(logoutTimer);
  }, []);

  const login = useCallback((token, expirationTime) => {
    setIsLoggedIn(true);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    setToken(token);
    const remainingDuration = calculateRemainingExpirationTime(expirationTime)
    logoutTimer = setTimeout(logout, remainingDuration);
  }, [logout]);

  useEffect(() => {
    if (tokenData != null) {
      logoutTimer = setTimeout(logout, tokenData.remainingDuration);
    }
  }, [tokenData, logout]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        token: token,
        login: login,
        logout: logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
