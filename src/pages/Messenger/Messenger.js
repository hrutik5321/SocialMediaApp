import "./Messenger.css";

import React, { useRef } from "react";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/Message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { isAutheticated } from "../../backend/auth";
import { useEffect } from "react";
import {
  getConversation,
  getMessage,
  sendMessage,
} from "../../backend/messanger";
import { io } from "socket.io-client";
import { useState } from "react";

function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const { token, user } = isAutheticated();
  var scrollRef = useRef();
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  const getConversations = async () => {
    if (token) {
      try {
        const res = await getConversation(token);
        setConversations(res);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = {
      conversationId: currentChat._id,
      sender: user._id,
      text: newMessage,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    const { conversationId, text, sender } = message;
    sendMessage({ sender, text, conversationId }).then(() => setNewMessage(""));
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });
  };

  const getMessages = async () => {
    try {
      if (currentChat) {
        const msg = await getMessage(currentChat._id);
        console.log(msg);
        setMessages(msg);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getConversations();
  }, []);
  useEffect(() => {
    getMessages();
  }, [currentChat, messages]);

  useEffect(() => {
    return scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              className="chatMenuInput"
              placeholder="Search for friends"
            />
            {conversations.map((c) => (
              <div
                onClick={() => {
                  setCurrentChat(c);
                  console.log(currentChat);
                }}
              >
                <Conversation key={c._id} conversation={c} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    placeholder="write something"
                    className="chatMessageInput"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
