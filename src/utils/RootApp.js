import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import Home from "../templates/js/Home";
import Login from "../templates/js/Login";

export default function RootApp() {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const token = localStorage.getItem("userInfo");
  return token ? <Home /> : <Login />;
}
