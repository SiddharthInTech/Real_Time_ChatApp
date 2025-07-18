import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Moment from "react-moment";
import { io } from "socket.io-client";

const ChatRoom = () => {
  const [data, setData] = useState({});
  const [msg, setMsg] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageContainerRef = useRef(null);

  const location = useLocation();

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_BACKEND_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(newSocket.id);
      if (location.state && location.state.room) {
        newSocket.emit("joinRoom", location.state.room);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [location.state]);

  // Set component data from location state
  useEffect(() => {
    if (location.state) {
      setData(location.state);
    }
  }, [location.state]);

  // Function to scroll to the bottom safely
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    } else {
      console.warn("messageContainerRef is not initialized yet.");
    }
  };

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      setTimeout(scrollToBottom, 100); // Ensure DOM updates before scrolling
    };

    socket.on("getLatestMessage", handleNewMessage);

    return () => {
      socket.off("getLatestMessage", handleNewMessage);
    };
  }, [socket]);

  // Scroll when messages array changes
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [allMessages]);

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const onSubmit = () => {
    if (msg && socket && data.name && data.room) {
      const newMessage = { time: new Date(), msg, name: data.name };
      socket.emit("newMessage", { newMessage, room: data.room });
      setMsg("");
      setTimeout(scrollToBottom, 100); // Scroll after sending a message
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="py-4 container-fluid d-flex justify-content-center align-items-center">
      <div className="chat-room-container px-4 shadow bg-dark text-dark border rounded w-full md:w-3/4 lg:w-1/2">
        <div className="text-center px-3 mb-4 text-capitalize">
          <h1 className="text-warning mb-4">{data?.room} Chat Room</h1>
        </div>
        <div
          ref={messageContainerRef}
          className="hide-scrollbar border rounded ml-4 p-4 mb-4 d-flex flex-column"
          style={{
            height: "450px",
            overflowY: "scroll",
            backgroundColor: "#2f303b",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {allMessages.map((msg, index) =>
            data.name === msg.name ? (
              <div key={index} className="row justify-content-end pl-5">
                <div className="d-flex flex-column align-items-end m-2 shadow p-2 bg-info border rounded"
                  style={{
                    maxWidth: "300px", // Fixed maximum width
                    width: "fit-content", // Shrink for shorter messages
                    wordBreak: "break-word", // Break long words
                    overflowY: "auto", // Add scroll if content exceeds max height
                    maxHeight: "400px" // Maximum height before scrolling
                  }}>
                  <div>
                    <strong className="m-1">{msg.name}</strong>
                    <small className="text-muted">
                      <Moment fromNow>{msg.time}</Moment>
                    </small>
                  </div>
                  <h4 className="m-1" style={{
                    whiteSpace: "pre-wrap", // Preserve line breaks and wrap text
                    overflowWrap: "break-word", // Break long words
                    margin: 0 // Remove default h4 margin
                  }}>
                    {msg.msg}
                  </h4>
                </div>

              </div>
            ) : (
              <div key={index} className="row justify-content-start">
                <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto"
                  style={{
                    maxWidth: "300px", // Fixed maximum width
                    width: "fit-content", // Shrink for shorter messages
                    wordBreak: "break-word", // Break long words
                    overflowY: "auto", // Add scroll if content exceeds max height
                    maxHeight: "400px" // Maximum height before scrolling
                  }}
                >
                  <div>
                    <strong className="m-1">{msg.name}</strong>
                    <small className="text-muted m-1">
                      <Moment fromNow>{msg.time}</Moment>
                    </small>
                  </div>
                  <h4 style={{
                    whiteSpace: "pre-wrap", // Preserve line breaks and wrap text
                    overflowWrap: "break-word", // Break long words
                    margin: 0 // Remove default h4 margin
                  }} className="m-1 ">{msg.msg}</h4>
                </div>
              </div>
            )
          )}
        </div>
        <div className="form-group d-flex gap-2 ml-2 px-2 justify-content-center">
          <input
            type="text"
            className="form-control bg-light flex-grow-1 mb-2 mb-md-2"
            name="message"
            onChange={handleChange}
            placeholder="Type your message"
            value={msg}
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            className="btn btn-warning mx-md-2 mb-2"
            onClick={onSubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send"
              viewBox="0 0 16 16"
            >
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
