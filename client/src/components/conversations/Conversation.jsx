import "./conversation.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState({});
  const API = process.env.REACT_APP_DEV_BASE_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    // V conversation.member jsou 2x id - userId a id přítele => pomocí kódu níže vyfiltrujeme pouze id které se nerovnají userId = id přítele.
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    // Získání usera z kterým má přihlášený user konverzaci (na základě conversation.members.id)
    const getUser = async () => {
      const res = await axios.get(`${API}users?userId=${friendId}`);
      // Nastavuje state user === friend
      setUser(res.data);
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        alt=""
        src={
          user.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
      />
      {/* Níže vypíšeme název přítele. */}
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
