import "./post.css";
import { MoreVert } from "@material-ui/icons";
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "./../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; // PF = Public Fodler z URL .env souboru
  const API = process.env.REACT_APP_DEV_BASE_URL;
  const { user: currentUser } = useContext(AuthContext);

  function swipe(postId) {
    var largeImage = document.getElementById(postId);
    largeImage.style.display = "block";
    largeImage.style.objectFit = "cover";
    var url = largeImage.getAttribute("src");
    window.open(url, "Image");
  }

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id)); // true = post je likenutý akt. userem | false = post není likenutý akt. userem
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${API}users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put(API + "posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {}

    setLike(isLiked ? like - 1 : like + 1); // je Post likenutý? ANO = odeber like z postu, NE = přidej like k postu
    // Kdybychom nechali pouze kód výše tak jen donekončená přidáváme like, protože nezměníme stav isLiked
    setIsLiked(!isLiked); //Zde změníme opečně stav Postu zda je likenutý (defaultně je false a touto negací poprvé řekneme že post je likenutý)
  };
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            {/* Pomocí kódu níže se zobrazí avatar podle userId postu*/}
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            {/* Pomocí kódu níže se username zobrazí podle userId objektu post*/}
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img
            id={post._id}
            className="postImg"
            src={PF + post.img}
            onClick={() => swipe(post._id)}
            alt=""
          />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}/like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}/heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
