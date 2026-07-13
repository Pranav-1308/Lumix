import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

  // ==========================
  // Logged In User
  // ==========================

  const [user, setUser] = useState(() => {

    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;

  });

  // ==========================
  // Register Flow Data
  // ==========================

  const [userData, setUserData] = useState({

    name: "",

    phone: "",

    avatar: null,

  });

  // ==========================
  // JWT Token
  // ==========================

  const [token, setToken] = useState(

    localStorage.getItem("token") || ""

  );

  // ==========================
  // Chats
  // ==========================

  const [chats, setChats] = useState([]);

  // ==========================
  // Selected Chat
  // ==========================

  const [selectedChat, setSelectedChat] = useState(null);

  // ==========================
  // Online Users
  // ==========================

  const [onlineUsers, setOnlineUsers] = useState([]);

  // ==========================
  // Authentication
  // ==========================

  const isAuthenticated = !!token;

  // ==========================
  // Persist User
  // ==========================

  useEffect(() => {

    if (user) {

      localStorage.setItem(

        "user",

        JSON.stringify(user)

      );

    } else {

      localStorage.removeItem("user");

    }

  }, [user]);

  // ==========================
  // Persist Token
  // ==========================

  useEffect(() => {

    if (token) {

      localStorage.setItem(

        "token",

        token

      );

    } else {

      localStorage.removeItem("token");

    }

  }, [token]);

  // ==========================
  // Logout
  // ==========================

  const logout = () => {

    setUser(null);

    setToken("");

    setChats([]);

    setSelectedChat(null);

    setOnlineUsers([]);

    localStorage.removeItem("token");

    localStorage.removeItem("user");

  };

  return (

    <UserContext.Provider

      value={{

        // User

        user,

        setUser,

        // Register

        userData,

        setUserData,

        // JWT

        token,

        setToken,

        // Authentication

        isAuthenticated,

        // Chats

        chats,

        setChats,

        // Selected Chat

        selectedChat,

        setSelectedChat,

        // Online Users

        onlineUsers,

        setOnlineUsers,

        // Logout

        logout,

      }}

    >

      {children}

    </UserContext.Provider>

  );

};

export const useUser = () => useContext(UserContext);








// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {

//   // ==========================
//   // Logged In User
//   // ==========================

//   const [user, setUser] = useState(() => {

//     const savedUser = localStorage.getItem("user");

//     return savedUser ? JSON.parse(savedUser) : null;

//   });

//   // ==========================
//   // Register Flow Data
//   // ==========================

//   const [userData, setUserData] = useState({

//     name: "",

//     phone: "",

//     avatar: null,

//   });

//   // ==========================
//   // JWT Token
//   // ==========================

//   const [token, setToken] = useState(

//     localStorage.getItem("token") || ""

//   );

//   // ==========================
//   // Chats
//   // ==========================

//   const [chats, setChats] = useState([]);

//   // ==========================
//   // Selected Chat
//   // ==========================

//   const [selectedChat, setSelectedChat] = useState(null);

//   // ==========================
//   // Online Users
//   // ==========================

//   const [onlineUsers, setOnlineUsers] = useState([]);

//   // ==========================
//   // Authentication
//   // ==========================

//   const isAuthenticated = !!token;

//   // ==========================
//   // Persist User
//   // ==========================

//   useEffect(() => {

//     if (user) {

//       localStorage.setItem(

//         "user",

//         JSON.stringify(user)

//       );

//     } else {

//       localStorage.removeItem("user");

//     }

//   }, [user]);

//   // ==========================
//   // Persist Token
//   // ==========================

//   useEffect(() => {

//     if (token) {

//       localStorage.setItem(

//         "token",

//         token

//       );

//     } else {

//       localStorage.removeItem("token");

//     }

//   }, [token]);

//   // ==========================
//   // Logout
//   // ==========================

//   const logout = () => {

//     setUser(null);

//     setToken("");

//     setChats([]);

//     setSelectedChat(null);

//     setOnlineUsers([]);

//     localStorage.removeItem("token");

//     localStorage.removeItem("user");

//   };

//   return (

//     <UserContext.Provider

//       value={{

//         // User

//         user,

//         setUser,

//         // Register

//         userData,

//         setUserData,

//         // JWT

//         token,

//         setToken,

//         // Authentication

//         isAuthenticated,

//         // Chats

//         chats,

//         setChats,

//         // Selected Chat

//         selectedChat,

//         setSelectedChat,

//         // Online Users

//         onlineUsers,

//         setOnlineUsers,

//         // Logout

//         logout,

//       }}

//     >

//       {children}

//     </UserContext.Provider>

//   );

// };

// export const useUser = () => useContext(UserContext);