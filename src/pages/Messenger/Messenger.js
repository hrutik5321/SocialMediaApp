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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("ws://localhost:8900"));
  }, []);

  const { token, user } = isAutheticated();
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
    const { conversationId, text, sender } = message;
    sendMessage({ sender, text, conversationId }).then(() => setNewMessage(""));
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

  var scrollRef = useRef();

  useEffect(() => {
    scrollRef?.current?.scrollIntroView({ behavior: "smooth" });
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
                    <Message message={m} own={m.sender === user._id} />
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
