import { useState, useEffect } from "react";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src="https://i.pinimg.com/550x/50/e1/32/50e132e0876f58632bbac562b916e180.jpg"
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Jakub Vlček</span>
      </div>

      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src="https://i.pinimg.com/550x/50/e1/32/50e132e0876f58632bbac562b916e180.jpg"
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Jakub Vlček</span>
      </div>

      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            className="chatOnlineImg"
            src="https://i.pinimg.com/550x/50/e1/32/50e132e0876f58632bbac562b916e180.jpg"
            alt=""
          />
          <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">Jakub Vlček</span>
      </div>
    </div>
  );
}
