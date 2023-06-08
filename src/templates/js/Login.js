import React, { useContext, useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import "bootstrap/dist/css/bootstrap.css";

import { AuthContext } from "../../utils/AuthContext";

function Login() {
  const { login, userInfo } = useContext(AuthContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBInput
        wrapperClass="mb-4"
        label="Username"
        id="form1"
        type="text"
        onChange={(event) => setUsername(event.target.value)}
      />
      <MDBInput
        wrapperClass="mb-4"
        label="Password"
        id="form2"
        type="password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={() => login(username, password)}
      >
        Login
      </button>
    </MDBContainer>
  );
}

export default Login;
