import "./feed.css";
import Share from "../share/Share";
import Post from "../post/Post";
import { Posts } from "../../dummyData";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const API = process.env.REACT_APP_DEV_BASE_URL;
  const { user } = useContext(AuthContext); // 1) Načtení aktuálního usera z kontextu
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`${API}posts/profile/${username}`)
        : await axios.get(`${API}posts/timeline/${user._id}`); // 2) Zobrazení timeline daného usera
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt); // nedřívější bude první, prohozením p1 a p2 by to bylo naopak
        })
      );
    };
    fetchPosts();
  }, [username, user]); // 3) Přidání závislosti - v useEffect() pracujeme s proměnnou user._id - musí mít explicitně danou závislost

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
