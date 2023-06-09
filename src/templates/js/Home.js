import React, { useEffect, useRef, useContext, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
  MDBScrollbar,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBCollapse,
  MDBNavItem,
  MDBNavLink,
} from "mdb-react-ui-kit";
import "bootstrap/dist/css/bootstrap.css";
import "../css/Home.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faSmile,
  faPaperPlane,
  faCheck,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../utils/AuthContext";
import { BASE_URL } from "../../utils/config";

export default function Home() {
  const chatContainerRef = useRef(null);
  const contactRef = useRef();
  const [sms, setSms] = useState("");
  const [chatSocket, setChatSocket] = useState();
  const [notifySocket, setNotifySocket] = useState();
  const {
    setUserInfo,
    userInfo,
    logout,
    contacts,
    contactsLoaded,
    setContactsLoaded,
    contactsList,
    messages,
    chatMessages,
    setMessages,
  } = useContext(AuthContext);

  useEffect(() => {
    setChatSocket(new WebSocket(`ws://64.227.176.7/ws/chat/chatroom/`));
    setNotifySocket(new WebSocket(`ws://64.227.176.7/ws/notify/chatroom/`));
    contacts();
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    if (localStorage.getItem("toId")) {
      chatMessages(JSON.parse(localStorage.getItem("toId")));
    }
  }, []);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, setMessages]);

  function newMessage(message) {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      chatSocket.send(
        JSON.stringify({
          message: message,
          to: localStorage.getItem("toId"),
          from: JSON.parse(localStorage.getItem("userInfo")).userId,
        })
      );
    }
  }

  function notify(contact, from) {
    if (notifySocket && notifySocket.readyState == WebSocket.OPEN) {
      notifySocket.send(
        JSON.stringify({
          contact: contact,
          from: from,
        })
      );
    }
  }

  if (
    chatSocket &&
    chatSocket.readyState == WebSocket.OPEN &&
    localStorage.getItem("userInfo")
  ) {
    chatSocket.onmessage = (e) => {
      e.preventDefault();
      let data = JSON.parse(e.data);
      if (
        JSON.parse(localStorage.getItem("userInfo"))?.userId == data.from ||
        JSON.parse(localStorage.getItem("userInfo"))?.userId == +data.to
      ) {
        // chatMessages(JSON.parse(localStorage.getItem("userInfo")).userId);
        // contacts();
        // let incomingMesssage = {
        //   created_at: data.time,
        //   from_name: data.contactName,
        //   from_user: data.from,
        //   id: data.latest_message_id,
        //   read_by: false,
        //   sms: data.message,
        //   to_name: data.to_name,
        //   to_user: +data.to,
        // };
        // let updatedMessage = [...messages, incomingMesssage];

        // setMessages(updatedMessage);

        chatMessages(JSON.parse(localStorage.getItem("toId")));
        contacts();

        if (JSON.parse(localStorage.getItem("toId")) == data.from) {
          console.log("notie");
          notify(
            data.from,
            JSON.parse(localStorage.getItem("userInfo")).userId
          );
          //   if (notifySocket && notifySocket.readyState == WebSocket.OPEN) {
          //     notifySocket.send(
          //       JSON.stringify({
          //         contact: data.from,
          //         from: JSON.parse(localStorage.getItem("userInfo")).userId,
          //       })
          //     );
          //   }
          // }
        }
      }
    };
  }

  if (
    notifySocket &&
    notifySocket.readyState == WebSocket.OPEN &&
    localStorage.getItem("userInfo")
  ) {
    notifySocket.onmessage = (e) => {
      e.preventDefault();
      let data = JSON.parse(e.data);
      if (
        JSON.parse(localStorage.getItem("userInfo"))?.userId == data.from ||
        JSON.parse(localStorage.getItem("userInfo"))?.userId == data.contact
      ) {
        contacts();
        if (
          JSON.parse(localStorage.getItem("toId")) == data.from ||
          JSON.parse(localStorage.getItem("toId")) == data.contact
        ) {
          console.log("messages");
          // const updatedMessage = messages.map((x) => {
          //   if (!x.read_by) {
          //     return { ...x, read_by: true };
          //   }
          //   return x;
          // });
          // setMessages(updatedMessage);
          chatMessages(JSON.parse(localStorage.getItem("toId")));
        }
      }
    };
  }

  function formatTime(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date >= today.setHours(0, 0, 0, 0)) {
      // Date is today
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
    } else if (date >= yesterday.setHours(0, 0, 0, 0)) {
      // Date is yesterday
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `yesterday`;
    } else {
      // Date is before yesterday
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
    }
  }

  return (
    <MDBContainer
      fluid
      className="py-5"
      style={{ backgroundColor: "#CDC4F9", height: "100vh" }}
    >
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <div className="navbar-brand">
            {JSON.parse(localStorage.getItem("userInfo")).name}
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    // setUserInfo({});
                    // setContactsLoaded(())
                    // localStorage.removeItem("userInfo");
                    // localStorage.removeItem("toId");
                    // localStorage.removeItem("toName");
                    logout();
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <MDBRow className="mt-3">
        <MDBCol md="12">
          <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
            <MDBCardBody>
              <MDBRow>
                <MDBCol
                  md="6"
                  lg="5"
                  xl="4"
                  className="mb-4 mb-md-0"
                  style={{
                    overflowY: "scroll",
                    maxHeight: 800,
                    borderRightColor: "black",
                    borderRightWidth: 10,
                  }}
                >
                  <div className="p-3">
                    <MDBInputGroup className="rounded mb-3">
                      <input
                        className="form-control rounded"
                        placeholder="Search"
                        type="search"
                      />
                      <span
                        className="input-group-text border-0"
                        id="search-addon"
                      >
                        <MDBIcon fas icon="search" />
                      </span>
                    </MDBInputGroup>

                    <MDBTypography listUnStyled className="mb-0">
                      {contactsList ? (
                        contactsList.map((x) => {
                          return (
                            <li className="p-2 border-bottom" key={x.id}>
                              <div
                                className="d-flex justify-content-between"
                                onClick={() => {
                                  localStorage.setItem("toId", x.id);
                                  localStorage.setItem("toName", x.name);
                                  chatMessages(x.id);
                                  notify(
                                    x.id,
                                    JSON.parse(localStorage.getItem("userInfo"))
                                      .userId
                                  );
                                }}
                                ref={contactRef}
                              >
                                <div className="d-flex flex-row">
                                  <div>
                                    <img
                                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                      alt="avatar"
                                      className="d-flex align-self-center me-3"
                                      width="60"
                                    />
                                    <span className="badge bg-success badge-dot"></span>
                                  </div>
                                  <div className="pt-1">
                                    <p className="fw-bold mb-0">{x.name}</p>
                                    <p className="small text-muted d-flex flex-row align-items-center">
                                      {x.latest_message_user ==
                                      JSON.parse(
                                        localStorage.getItem("userInfo")
                                      ).userId ? (
                                        x.latest_message_read ? (
                                          <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{
                                              color: "black",
                                            }}
                                          />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faCheck}
                                            style={{
                                              color: "lightgrey",
                                            }}
                                          />
                                        )
                                      ) : (
                                        <></>
                                      )}
                                      {x.latest_message?.length > 28
                                        ? x.latest_message.slice(0, 28) + "..."
                                        : x.latest_message}
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-1">
                                  <p className="small text-muted mb-1">
                                    {formatTime(x.latest_message_time)}
                                  </p>
                                  {x.latest_message_user !==
                                  JSON.parse(localStorage.getItem("userInfo"))
                                    .userId ? (
                                    <span className="badge bg-danger rounded-pill float-end">
                                      {x.unread_messages_count}
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      {/* {contactsList &&
                        localStorage.getItem("toId") &&
                        chatMessages(localStorage.getItem("toId"))} */}
                    </MDBTypography>
                  </div>
                </MDBCol>
                <MDBCol md="6" lg="7" xl="8" style={{ position: "relative" }}>
                  <MDBCol
                    style={{ backgroundColor: "lightblue" }}
                    className="d-flex flex-row justify-content-between align-items-center py-1 ps-3"
                  >
                    <MDBCol className="d-flex flex-row align-items-center">
                      <div>
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                          alt="avatar"
                          className="d-flex align-self-center me-3"
                          width="30"
                        />
                      </div>
                      <div>{localStorage.getItem("toName")}</div>
                    </MDBCol>
                  </MDBCol>
                  <MDBCol
                    style={{
                      overflowY: "scroll",
                      maxHeight: 600,
                      marginBottom: 50,
                      backgroundColor: "#F5F5F5",
                    }}
                    ref={chatContainerRef}
                  >
                    {messages ? (
                      messages.map((x) => {
                        return x.from_user ==
                          JSON.parse(localStorage.getItem("userInfo"))
                            .userId ? (
                          <div
                            className="d-flex flex-row justify-content-end"
                            key={x.id}
                          >
                            <div>
                              <div
                                className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary"
                                style={{ position: "relative" }}
                              >
                                {x.sms}
                                <div style={{ marginTop: 10 }}>
                                  {x.read_by ? (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{
                                        color: "black",
                                        position: "absolute",
                                        bottom: 0,
                                        left: 4,
                                      }}
                                    />
                                  ) : (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      style={{
                                        color: "lightgrey",
                                        position: "absolute",
                                        bottom: 0,
                                        left: 4,
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                              <p
                                className="small me-3 mb-3 rounded-3 text-muted"
                                style={{ fontSize: 10 }}
                              >
                                {formatTime(x.created_at)}
                              </p>
                            </div>
                            <img
                              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                              alt="avatar 1"
                              style={{ width: "45px", height: "100%" }}
                            />
                          </div>
                        ) : (
                          <div
                            className="d-flex flex-row justify-content-start"
                            key={x.id}
                          >
                            <img
                              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                              alt="avatar 1"
                              style={{ width: "45px", height: "100%" }}
                            />
                            <div>
                              <div
                                className="small p-2 ms-3 mb-1 rounded-3"
                                style={{
                                  backgroundColor: "white",
                                }}
                              >
                                {x.sms}
                              </div>
                              <p
                                className="small ms-3 mb-3 rounded-3 text-muted float-end"
                                style={{ fontSize: 10 }}
                              >
                                {formatTime(x.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </MDBCol>

                  <div
                    className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-3"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 20,
                      left: 10,
                    }}
                  >
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                      alt="avatar 3"
                      style={{ width: "40px", height: "100%" }}
                    />
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="exampleFormControlInput2"
                      placeholder="Type message"
                      value={sms}
                      onChange={(event) => {
                        const text = event.target.value;
                        setSms(text);
                      }}
                    />
                    <a className="ms-1 text-muted">
                      <FontAwesomeIcon icon={faPaperclip} />
                    </a>
                    <div className="ms-3 text-muted">
                      <FontAwesomeIcon icon={faSmile} />
                    </div>
                    <button
                      className="ms-3 btn btn-primary"
                      onClick={(event) => {
                        event.preventDefault();
                        newMessage(sms);
                        setSms("");
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
