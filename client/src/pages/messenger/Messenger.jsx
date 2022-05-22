import "./messenger.css";
import Topbar from "./../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "./../../components/message/Message";
import ChatOnline from "./../../components/chatOnline/ChatOnline";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";

export default function Messenger() {
  const API = process.env.REACT_APP_DEV_BASE_URL;
  const [conversations, setConversations] = useState([]);
  const { user } = useContext(AuthContext);

  // nahrání konverzací z databáze do state po načtení stránky
  useEffect(() => {
    const getConversations = async () => {
      const res = await axios.get(`${API}conversations/${user._id}`);
      setConversations(res.data);
    };
    getConversations();
  }, [user]);
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="Search for friends"
              className="chatMenuInput"
            />
            {conversations.map((c) => (
              <Conversation key={c._id} conversation={c} currentUser={user} />
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {" "}
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message own={true} />
              <Message />
            </div>
            <div className="chatBoxBottom">
              <textarea
                className="chatMessageInput"
                placeholder="Write something..."
              ></textarea>
              <button className="chatSubmitButton">Send</button>
            </div>
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
