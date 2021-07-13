import { NaturePeopleOutlined } from "@material-ui/icons";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { isAutheticated } from "../../backend/auth";
import { getUser } from "../../backend/messanger";
import "./Conversation.css";

function Conversation({ conversation }) {
  const { user, token } = isAutheticated();
  const [luser, setLuser] = useState(null);

  useEffect(async () => {
    const friendId = conversation.members.find((m) => m !== user._id);
    const friendUser = await getUser(token, friendId);
    console.log(friendUser);
    setLuser(friendUser);
  }, []);
  return (
    <div className="conversation">
      <img
        src="http://smaabacus.com/themes/user/assets_old/img/avatar/male.png"
        className="conversationImg"
        alt=""
      />
      <span className="conversationName">
        {luser ? luser.name : "John Doe"}
      </span>
    </div>
  );
}

export default Conversation;
