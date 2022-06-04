import "./messenger.css";
import Topbar from "./../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "./../../components/message/Message";
import ChatOnline from "./../../components/chatOnline/ChatOnline";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import zIndex from "@material-ui/core/styles/zIndex";

export default function Messenger() {
  const API = process.env.REACT_APP_DEV_BASE_URL;
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [friendId, setFriendId] = useState(null);
  const [friendProfilePicture, setFriendProfilePicture] = useState(
    "person/noAvatar.png"
  );
  const [messages, setMessages] = useState(null);
  const socket = useRef();
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    //Pomocí kódu níže kontrolujeme zda arrivalMessage není prázdný a zároven zabranujeme aby zprávy viděl někdo jiný mimo 2 členy chatu.
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  //napojení na socket.io & getMessage
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
  //získání userů
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);
  //nahrání konverzací z databáze do state po načtení stránky
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${API}conversations/${user?._id}`);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);
  //získání zpráv z chatu a přiřazení profilového obrázku z konverzace
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${API}messages/${currentChat?._id}`);
        setFriendId(currentChat?.members.find((member) => member !== user._id));
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    const getFriendProfilePicture = async () => {
      try {
        const res = await axios.get(`${API}users?userId=${friendId}`);
        setFriendProfilePicture(res.data.profilePicture);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
    getFriendProfilePicture();
  }, [currentChat, friendId]);
  //scrollování na konec chatu
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //odeslání zprávy chatu (na server & socket.io)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverId, //receiverId => receiverId: receiverId;
      text: newMessage,
    });

    try {
      const res = await axios.post(`${API}messages/`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

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
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation
                  key={Date.now()}
                  conversation={c}
                  currentUser={user}
                />
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
                      <Message
                        key={Date.now()}
                        message={m}
                        own={m.sender === user?._id}
                        profilePicture={
                          m.sender === user?._id
                            ? user?.profilePicture
                            : friendProfilePicture
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Write something..."
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
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  );
}
