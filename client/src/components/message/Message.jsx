import "./message.css";
import { format } from "timeago.js";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Message({ own, message, profilePicture }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //Kód níže se provede při každé zprávě => to je špatně - chceme nastavit profilePicture na základě own
  // V messenger.jsx dát receiverId do state => následně profilePicture = own ? users?userId=${userId} : users?userId=${receiverId}
  // Nebo vložit celý obj user.profilePicutre vs m.sender.profilePicture

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img className="messageImg" src={PF + profilePicture} alt="" />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
