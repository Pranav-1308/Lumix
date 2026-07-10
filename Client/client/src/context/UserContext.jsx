import { createContext, useContext, useState } from "react";

// Create Context
const UserContext = createContext();

// Provider Component
export function UserProvider({ children }) {

  // User Registration Data
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    avatar: null,
  });

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export function useUser() {
  return useContext(UserContext);
}