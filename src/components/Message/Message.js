import React from "react";
import "./Message.css";
import { format } from "timeago.js";

function Message({ message, own }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="http://smaabacus.com/themes/user/assets_old/img/avatar/male.png"
          alt=""
        />
        <p className="messageText">
          {message.text ? message.text : "Start Chatting"}
        </p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}

export default Message;
