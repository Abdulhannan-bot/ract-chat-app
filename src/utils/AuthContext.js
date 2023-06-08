import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

import { BASE_URL } from "./config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({});
  const [contactsLoaded, setContactsLoaded] = useState(false);
  const [contactsList, setContactsList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState();

  const login = (username, password) => {
    console.log(username, password);
    axios
      .post(`${BASE_URL}/api/login`, {
        username,
        password,
      })
      .then((res) => {
        let loginInfo = res.data;
        setUserInfo({ ...loginInfo });
        localStorage.setItem("userInfo", JSON.stringify(loginInfo));
      })
      .catch((err) => {
        console.log(`login error: ${err}`);
      });
  };

  const contacts = () => {
    axios
      .get(
        `${BASE_URL}/api/contacts-list/${
          JSON.parse(localStorage.getItem("userInfo")).token
        }`,

        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo")).token
            }`,
          },
        }
      )
      .then((res) => {
        setContactsLoaded(true);
        setContactsList(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(`contacts error: ${err}`);
      });
  };

  const chatMessages = (toUser) => {
    axios
      .get(
        `${BASE_URL}/api/chat_room/${
          JSON.parse(localStorage.getItem("userInfo")).token
        }/${toUser}`,
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo")).token
            }`,
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setMessages(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        console.warn(`chatroom error: ${err}`);
      });
  };

  const logout = () => {
    axios
      .post(
        `${BASE_URL}/api/logout/${
          JSON.parse(localStorage.getItem("userInfo")).token
        }`,
        {},
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem("userInfo")).token
            }`,
          },
        }
      )
      .then((res) => {
        setUserInfo({});
        localStorage.removeItem("userInfo");
        localStorage.removeItem("toId");
        localStorage.removeItem("toName");
        setContactsList(null);
        setMessages(null);
      })
      .catch((err) => {
        console.warn(`logout error: ${err}`);
      });
  };

  // useEffect(() => {
  //   console.log(userInfo);
  // }, [userInfo]);

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        contactsLoaded,
        contactsList,
        messages,
        setUserInfo,
        login,
        logout,
        contacts,
        chatMessages,
        setContactsLoaded,
        setMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
