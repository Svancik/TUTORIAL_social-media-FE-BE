/*
A) Iniciace
-----------------------------------------------------------------------------------------------------------------------------
- naimportujeme složku s projektem backendu a frontendu
- spustíme FE
- spustíme BE


B) REACT ROUTER DOM (/profile, /login, /register, /)
-----------------------------------------------------------------------------------------------------------------------------
a) naimportujeme REACT-ROUTER-DOM (kvůli zobrazování odkazů)
    - npm add react-router-dom
b) zjistíme Z DOKUMENTACE POUŽÍT REACT-ROUTER-DOM - https://v5.reactrouter.com/web/guides/quick-start
    (již jsme používali z kurzu Moshe)
    - import { BrowserRouter, Routes, Route} from "react-router-dom";
POZOR ZMĚNA!!!! NOVÁ VERZE REACT-ROUTER-DOM (v6)
    - používá se PROPS element kde musí být {<Komponenta/>} (dříve se používalo component = {Komponenta})
    - používá se Routes namísto Switch*/

// App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
} /*

PROBLÉM S ROUTES A CESTAMI K SOUBORŮM:
Když přejdeme na url http://localhost:3000/profile/safak skrze <Route path="/profile/:username" element={<Profile/>}/>
    => tak se nezobrazí fotografie a nepoužijí se ani styly
        => protože v dummyData.js máme napsanou cestu natvrdo profilePicture: "assets/person/1.jpeg"
            => tudíž když jsme na /profile/safak tak se hledá obrázek v /profile/safak/assets/person/1.jpeg
ŘEŠENÍ:
c) Použijeme enviromentální proměnnou - .env soubor kde uložíme natvrdo cestu k souboru: REACT_APP_PUBLIC_FOLDER = http://localhost:3000/assets
c1) enviromentální proměnnou si uložíme do konstanty PF, PF = Public Fodler z URL .env souboru. */
const PF = process.env.REACT_APP_PUBLIC_FOLDER; /*
c2) přidáme to k cestě souboru pomocí +*/
<img className="postImg" src={PF + post.photo} alt="" />;/*
c3) uvnitř index.html přidáme toto URL ke stylům a přesuneme styles.css do assets.
c4) použijeme to i v profile page.*/
src={`${PF}post/3.jpeg`}/*




C) NAČÍTÁNÍ PŘÍSPĚVKŮ Z API SERVERU DO STATE A NA TIMELINE (FETCHING TIMELINE POSTS)
-----------------------------------------------------------------------------------------------------------------------------
Nyní chceme získat data z našeho backendu který běží na portu 8800.

a) Vstoupíme do klienta do package.jsona nastavíme novou vlastnost "proxy" : "http://localhost:8800/api"

b) Nainstalujeme AXIOS

c) Upravíme objekt v kolekcích na MongoDb (přidáme vlastnosti jako relationship, city, from k userum a img k postům)

Nyní chceme fetchovat data na timeline, tzn. že budeme chtít z MongoDB načíst své příspěvky a příspěvky uživatelů které sledujeme.
    => K tomu použijeme kód get timeline posts uvnitř api/routes/posts.js

    Good practice: GET request by neměl uvnitř těla req.body.userId obsahovat data (to může být u PUT/POST).
    V ukázce níže tomu tak je a je to ŠPATNĚ, změníme tedy kód na to co je v komentáři.*/
    //get timeline posts
    router.get("/timeline/all", async (req,res)=>{                  // => router.get("/timeline/:userId", async (req,res)=>{
        try{
            const currentUser = await User.findById(req.body.userId);   // =>  const currentUser = await User.findById(req.params.userId);
            const userPosts = await Post.find({userId: currentUser._id});   
            const friendPosts = await Promise.all(
                currentUser.followings.map(friendId=>{    
                    return Post.find({userId: friendId});
                })
            );
            res.json(userPosts.concat(...friendPosts));
        } catch(err){
            res.status(500).json(err);
        }
    });/*

d) Uvniř Feed.jsx odstraníme import Posts z dummyData.js.
e) Použijeme useState HOOK abychom vytvořili state posts ve kterém budou uloženy posty
f) Použijeme useEffect HOOK abychom fetchovali data skrze axios 1x při načtení stránky
    Jak funguje useEffect() HOOK?*/x
        useEffect(() => {
            console.log("feed rendered");
        });
        <input type="text" onChange={(e) => setText(e.target.value)} />/*
        Na consoly se vypíše "feed rendered" pokaždé když dojde k re-renderování stránky, neboli POKAŽDÉ KDYŽ DOJDE KE ZMĚNĚ STATE.
        - Vždy když do inputu výše něco napíšeme, tak každým stiskem klávesy se znovu vypíše hláška "feed rendered".
        Argumentem useEffect HOOKu může být závislost (DEPENDECY).
    Hook useEffect ZÁVISLOSTI (vykonej pouze při změnu 1 state)
        V kódu níže dojde k vypsání "feed rendered" POUZE KDYŽ SE ZMĚNÍ STATE text.
            => tzn. že se vypíše "feed rendered" pokaždé když se změní input níže, jelikož se používá setText(e.target.value)*/
        useEffect(() => {
            console.log("feed rendered");
        }, [text]);
        <input type="text" onChange={(e) => setText(e.target.value)} />/*
    Hook useEffect POUZE 1x PŘI NAČTENÍ STRÁNKY
        Pokud nastavízme "EMPTY DEPENDENCIES" tak se useEffect HOOK vykoná pouze 1x při načtení stránky,tzn. že "feed rendered" se zobrazí 1x*/
        useEffect(() => {
            console.log("feed rendered");
        }, []);
        <input type="text" onChange={(e) => setText(e.target.value)} />/*
    
e) Vypneme CORS službu abychom z API LOCALHOSTU načítali data do CLIENTA LOCALHOSTU. (google extension)
    CORS DŮLEŽITÉ - PROBLÉM S LOCALHOSTEM API & CLIENT.
        "react-dom.development.js:86 Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to 
        the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"
    CORS ZABRANUJE ABYCHOM Z LOCALHOST:3000 PŘISTOUPILI NA LOCALHOST:8800 KDE BĚŽÍ API (z bezpečnostních důvodů)
            => musíme naisntalovat extension do google "Moesif CORS" a CORS bude ignorován.

f) Načteme data z API do stata uvnitř useEffect HOOKU.*/
    //Feed.jsx
    const api = process.env.REACT_APP_DEV_BASE_URL;     // uvnitř .env: REACT_APP_DEV_BASE_URL=http://localhost:8800/api/
    useEffect(() => {
        const fetchPosts = async () => {
          const res = await axios.get(
            `${api}posts/timeline/624350a8df288254db35b02d` // toto je id usera, načtou se příspěvky usera a přátel které sleduje
          );
          setPosts(res.data);   // tyto příspěvky se uloží do res.data
        };
        fetchPosts(); // zavolá se async fce, jelikož hook nemůže být async fce => museli jsme zapouzdřit kód do fce uvnitř hooku
      }, []);/*

    Tyto data ze state budeme nyní předávat do komponenty jež renderuje Feed:*/
        //Feed.jsx
        return (
            <div className="feed">
            <div className="feedWrapper">
                <Share />
                {posts.map((p) => ( // toto je ze state
                <Post key={p.id} post={p} />
                ))}
            </div>
            </div>
        );/*

*** HOTOVO: NYNÍ UKLÁDÁME DO STATE DATA Z API SERVERU A MÁME TIMELINE POSTY (tzn. posty usera s id v URL + posty lidí které user sleduje)


D) NAČÍTÁNÍ USERŮ Z API DO STATE A ZOBRAZENÍ DAT USERA V POSTU na základe post.id
    - Zkopírujeme useEffect HOOK z Feed.jsx do Post.jsx. 
    - Zbavíme se dummyData.js => budeme již načítat data z BE.
PRACUJEME V Posts.jsx
Již se nám podařilo získat Posts z BE uvnitř Feed.jsx a skrze PROPS předáváme z Feed.jsx objekt post do Posts.jsx
    => Tyto posts obsahují vlastnost .userId (Post.userId)
        => My chceme aby se v postu zobrazilo jméno uživatele (User.username)
            => Naprogramujeme tedy useEffect HOOK uvnitř Post.jsx a najdeme usera jehož id === post.userId
                => Username takto nalezeného usera vložíme do Postu.

a) Naprogramujeme useEffect HOOK uvnitř Post.jsx, kde najdeme username na základě */
//Posts.jsx
// {post} získáváme z Feed.jsx kde mapujeme posts ze state do této Post komponenty: posts.map((p) => (<Post key={p.id} post={p} />))}
export default function Post({ post }) {
    const [like, setLike] = useState(post.like);
    const [isLiked, setIsLiked] = useState(false);
    const [user, setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER; 
    const API = process.env.REACT_APP_DEV_BASE_URL;
    useEffect(() => {
      const fetchUser = async () => {
        const res = await axios.get(`${API}users/${post.userId}`);  // a1) Nalezneme obj usera na základě post.userId
        setUser(res.data);  // a2) Usera uložíme do state
      };
      fetchUser();
    }, []);/*

b) Vložíme data o userovy do renderované komponenty Postu:*/ 
//Posts.jsx return(...
    {/* Pomocí kódu níže se zobrazí avatar podle userId postu*/}
    <img className="postProfileImg" src={user.profilePicture} alt="" />     //z useState hooku zpřístupnujeme user.profilePicture
    {/* Pomocí kódu níže se username zobrazí podle userId objektu post*/}
    <span className="postUsername">{user.username}</span>                   //z useState hooku zpřístupnujeme user.username
/* ...)
PROBLÉM: V databázi neexistuje vlastnost user.profilePicture
ŘEŠENÍ: Nastavíme přes OR operátor, že pokud neexistuje user.profilePicture, tak se použije defaultní avatar.

c) Pomocí OR || operátoru nastavíme aby .profilePicture se nastavil na defaultní avatar pokud neexistuje user.profilePicture.*/
//Posts.jsx
    {/* Pomocí kódu níže se zobrazí avatar podle userId postu*/}
    <img className="postProfileImg" src={user.profilePicture || PF + "person/noAvatar.png"} alt=""/>/*

HOTOVO: NYNÍ JSME NAPOJILI post.userId na Usera a vložili data o userovy do postu + jsme nastavili defaultní profilový obrázek.


E) NAČTENÍ DATUMU Z MongoDB DO POSTU (knihovna timeago)
Nainstalujeme knihovnu pro práci s datumem timeago uvnitř clienta
    - npm install timeago.js

Nastudujeme dokumentaci timeago.js
    - podle dokumentace timago abychom získali formát x seconds ago, tak musíme použít timeago.format(new Date());  => "just now" - nynější čas

a) Naimportujeme knihovnu uvnitř Post.jsx*/
    - import { format } from "timeago.js";/*

b) Použijeme format(post.createdAt) k přeformátování formátu datumu z MongoDb na formát "x weeks ago" / "x hours ago" / "just now"*/
    - <span className="postDate">{format(post.createdAt)}</span>/*


PROBLÉM S DEPENDENCY V useEffect HOOKU:
    - Pokaždé když používáme uvnitř useEffect HOOKU nějakou proměnnou jež se mění
        => tak musíme nastavit explicitně DEPENDENCY na tuto proměnou
            => aby došlo k znovu provedení useEffect HOOKu při provedení této změny proměnné
    - Níže je ukázka před a po, kdy jsme pracovali s proměnnou post.userId*/
//PŘED
useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${API}users/${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, []);
//PO
useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${API}users/${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);/*

HOTOVO: Nyní úspěšně fetchujeme data ze serveru na náš frontend do Postu.
PROBLÉM: Máme nastavené userId natvrdo uvnitř kódu Feed.jsx */
const res = await axios.get(
        `${API}posts/timeline/624350a8df288254db35b02d`
      );/*j
ŘEŠENÍ: CONTEXT API - "Context provides a way to pass data through the component tree without having to pass props down manually at every level."



F) CONTEXT API / REDUX - PŘEDÁVÁNÍ Usera
Díky Contextu dokážeme předávat data přes několik komponent, aniž bychom museli několikrát vkládat do PROPS podřízených komponent.
My potřebujeme přistupovat k Userovy na několika komponentách a toho docílíme pouze skrze Context.
User budeme potřebovat v:
    - post komponentě
    - likenutí
    - profile komponentě
    - rightbar komponentě
    - sidebar komponentě
        => Z TOHO DŮVODU SI HO ULOŽÍME DO CONTEXT API

Proč volíme Context API namísto REDUXU?
    - malá aplikace - nemáme mnoho věcí jež potřebujem mít uložených v contextu
    - málo četné změny - data se nemění tak často, pouze párkrát
Kdybychom pracovali s větší contextem a potřebovali bychom více věcí v contextu tak bychom použili REDUX.

Jak použijeme Context (React)?
 - Nahradíme v `${API}posts/timeline/624350a8df288254db35b02d` userId "624350a8df288254db35b02d" ABY BYLO DYNAMICKÉ.


G) KONDIČNÍ RENDEROVÁNÍ PROFILE PAGE POSTŮ (HOME: user + followers, PROFILE: user)
Musíme rozlišit situaci kdy jsme na profilu a chceme tedy zobrazit POUZE posty daného uživatele a nikoliv jeho přátel.
Jak to rozlišit?
    a) Vložíme uvnitř Profile.jsx do komponenty <Feed> PROPS username.
    b) Na základě PROPS username uvnitř <Feed> nastavíme kondiční renderování  komponenty.
        - Uvnitř FEED na základě username zjistíme zda jsme / nejsme na homepage / profilePage
    c) Budeme tedy používat různé GET metody v API, get timelinePosts() & get userPosts()
    d) Vytvoříme v API GET metodu pro získání postů POUZE usera. */
        // api/posts.js
        router.get("/profile/:username", async (req, res) => {
            try {
            const user = await User.findOne({ username: req.params.username }); // Nejdříve nalezneme usera na základě username z URL
            const posts = await Post.find({ userId: user._id });  // Na základě id usera nalezneme posty usera
            res.status(200).json(posts);    //posty budeme returnovat
            } catch (err) {
            res.status(500).json(err);
            }
        });/*
    e) KONDIČNĚ UPRAVÍME useEffect HOOK KDE FETCHUJEME DATA ZE SERVERU: */
        // client/Feed.jsx
        useEffect(() => {
            const fetchPosts = async () => {
              const res = username    //username získáváme z PROPS
                ? await axios.get(`${API}posts/profile/${username}`)    //použijeme novou metodu z d) pokud je v URL username
                : await axios.get(`${API}posts/timeline/624350a8df288254db35b02d`);     //
              setPosts(res.data);
            };
            fetchPosts();
          }, []);/*

H) FETCHOVÁNÍ DAT {user} Z MongoDB (API) DO Profile.jsx (Query, useParams)
-----------------------------------------------------------------------------------------------
Uvnitř Profile.jsx budeme podobně jako v Feed.jsx získávat data z API.
Chceme z API získat "User Information" (City, From, Relationship)
    - K tomu potřebujeme mít username => TO MÁME Z URL
    a) Zkopírujeme useEffect HOOK & user (state) z Post.jsx do Profile.jsx 
    b) Naimportujeme axios a potřebné soubory závislé na naší kopii z <Post>
V čem spočívá získávání dat o userovy?
    1. Z username z URL získáme userId
    2. Upravíme API GET metodu "get a user" uvnitř users.js 
        => ZÍSKÁME DATA POMOCÍ QUERY
Jak se používá QUERY?*/
// QUERY se nachází za otazníkem v URL
    localhost:8800/users?username=xxx&userId=123
// Přistoupení k datům z QUERY v URL můžeme pomocí kódu níže
    const userId = req.query.userId;
    const username = req.query.username;/*
    c) UPRAVÍME GET REQUEST "get a user" => APLIKUJEME QUERY */
    // get a user
    router.get("/", async(req,res) => {
        const userId = req.query.userId;        // získáme z QUERY userId
        const username = req.query.username;    // nebo získáme z QUERY username
        try{
            const user = userId                       // Pokud existuje userId, tzn. je v QUERY za "?"" v URL (localhost:8800?userId=111)
            ? await User.findById(req.params.id)          // => ANO: tak vyhledáme usera na základě userId pomocí findById
            : await User.findOne({username: username});       // => NE: tak vyhledáme usera pomocí jeho username
            const {password, updatedAt, ...other} = user._doc;
            res.status(200).json(other);
        } catch(err){
            res.status(500).json(err);
        }
    });/*
    d) V Profile.jsx ZAVOLÁME GET REQUEST z bodu c) výše a NA ZKOUŠKU VLOŽÍME "?username=john": */
    // Profile.jsx
    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`${API}users?username=john`);     // Vyzkoušíme nalezení usera na základě username v Query
          setUser(res.data);
          alert(res.data);
        };
        fetchUser();
      }, []); /*
    e) V Profile.jsx budeme dynamicky renderovat informace o uživateli na základě response z GET requestu s "username=john"*/
    // Profile.jsx
    <div className="profileInfo">
        <h4 className="profileInfoName">{user.username}</h4>    {/* DYNAMICKY RENDERUJEME DATA O USEROVY JEŽ MÁME Z BE (API) */}
        <span className="profileInfoDesc">{user.desc} </span>   
     </div> /*
    f) Upravíme Post.jsx jelikož jsme upraivli GET request (users.js) TAK MUSÍME upravit Post.jsx kde GET request POUŽÍVÁME*/
    // původní Post.jsx
    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`${API}users/${post.userId}`);    // NEBUDE FUNGOVAT => MUSÍME UPRAVIT NA QUERY VÝRAZ
          setUser(res.data);
        };
    // nový Post.jsx
    useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${API}users?userId=${post.userId}`);
      setUser(res.data);
    };/*
HOTOVO: NYNÍ POUŽÍVÁME GET REQUEST (users.js) K ZÍSKÁNÍ OBJ USERA Z MongoDB POMOCÍ QUERY (v postu ?userId=xxx & v profile ?username=xxx)
    g) Předáme data do <Rightbar> komponenty, abychom mohli dynamicky vyplnit User Information (City, From, Relationship) v Rightbaru
        - Profile.jsx => PROPS({user}) => Rightbar.jsx
        g1) Do Rightbar.jsx nám vstupuje user kterého jsme získal z MongoDB na základě username (platí pro Profile.jsx)*/
        export default function Rightbar({ user }) { /*
        g2) V Rightbar na základě obj usera vyplníme user information s tím, že kondičně vyrenderujeme vztah na základě hodnot: 1,2, nic*/
          <span className="rightbarInfoKey">City: </span>
          <span className="rightbarInfoValue">{user.city} </span>
          <span className="rightbarInfoKey">From: </span>
          <span className="rightbarInfoValue">{user.from} </span>
          <span className="rightbarInfoKey">Relationship: </span>
          <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "N/A"} </span> /*
        g3) Uvnitř Profile.jsx na základě usera z MongoDB nastavíme COVER & PROFILE PICTURE => když nebude tak nastavíme defaultní*/
            <div className="profileCover">
            <img
            className="profileCoverImg"
            src={user.coverPicture || PF + "person/noCover.png"}
            />
            <img
            className="profileUserImg"
            src={user.profilePicture || PF + "person/noAvatar.png"}
            />
        </div>/*
HOTOVO: DYNAMICKY GENERUJEME PROFILE PAGE NA ZÁKLADĚ USERA V URL (v params requestu)
            - Načteme user information z databáze => user.city, user.from, user.relationship, user.coverPicture, user.profilePicture
            - Nastavíme profile a cover picture na základě dat z databáze => případně nastavíme defaultní image pro profile a cover
PROBLÉM: NATVRDO MANUÁLNĚ vkládáme do URL params username A NENAČÍTÁME HO Z URL*/ 
    // Profile.jsx
    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`${API}users?username=john`);//natvrdo píšeme => to nechceme => chceme číst z URL a předat do axios
          setUser(res.data);
        };/*
ŘEŠENÍ: useParams() HOOK
    h) Použití useParams() HOOKu k přečtení dat z URL
        h1) Naimportujeme useParams hook a vložíme do console.log() výsledek z useParams();*/
        // Profile.jsx
        import { useParams } from "react-router";
        const params = useParams();
        console.log(params); // => získáme tím {username: "john"} PROTOŽE v "App.js" kde máme Route jsme pojmenovali "profile/:username"
        // App.js
        <Route path="/profile/:username" element={<Profile/>}/> /* zde jsme nastavili název proměnné v URL na "username"
        h2) Jelikož cokoliv v query za /profile/ bude uloženo do params jako proměnná username, tak k ní můžeme přistoupit jako k username. */
        // Profile.jsx
        const username = useParams().username; /* localhost:3000/profile/john => const username = "john"
    i) Vložení username z PARAMS URL do GET REQUESTU v useEffect() HOOKU. */
        // Profile.jsx
        useEffect(() => {
            const fetchUser = async () => {
              const res = await axios.get(`${API}users?username=${username}}`); // username jsme získali skrze useParams()
              setUser(res.data);
            };/*
        i1) DŮLEŽITÉ: uvnitř useEffect HOOKU (fetchUser fce) PRACUJEME S PROMĚNNOU => musíme VYTVOŘIT ZÁVISLOST jako arg useEffect hooku.*/
        useEffect(() => {
            const fetchUser = async () => {
            const res = await axios.get(`${API}users?username=${username}}`);
            setUser(res.data);
            };
            fetchUser();
        }, [username]); /* tímto říkáme že useEffect HOOK se má provést znovu v momentě kdy se změní username => DEPENDENCY / závislost



I) LOGIN - CONTEXT API
------------------------------------------------------------------------------ 
Budeme využívat CONTEXT API k předávání usera v rámci LOGIN & REGISTER.
    a) Založíme novou složku uvnitř client/src s názvem "context"
        a1) Uvnitř složky vytvoříme 3 soubory:
            - AuthContext.js
            - AuthReducer.js
            - AuthActions.js

DŮLEŽITÉ: Conntext, Reducer a Actions jsou HLAVNÍMI 3 ELEMENTY CONTEXT API.
 - Někteří lidé zapisují v 1 souboru Actions, Reducers, Context => TO JE ŠPATNĚ => PROTO MÁME 3 soubory pro 3 HLAVNÍ ELEMENTY Context API

    b) Login formulář (Login.jsx) - nastavíme event handler do Form aby se po kliknutí na button "Log In"*/
    <form className="loginBox" onSubmit={handleClick}></form>/*
        b1) Nechceme aby po kliknutí na login se stránka obnovila - tomu zabráníme kódem níže.*/
        const handleClick = (e) => {    // e jako event vstupuje do eventHandleru
            e.preventDefault();         // e.preventDefault() zabranuje obnnovení stránky
            console.log("clicked");
          };/*

    c) useRef() HOOK - pomocí useRef() uložíme hodnotu input pole po submitu ("Log In") v proměnné 
                        (nepoužíváme useState - dochází k re-renderování při každé změně textu)
        c1) Naimportujeme useRef() uvnitř Login.jsx */
            import { useRef } from "react";/*
        c2) Vytvoříme 2 const přes useRef(), KTERÉ BUDOU REFEROVAT NA INPUTY formuláře.*/ 
            const email = useRef();
            const password = useRef();/*
        c3) Nastavíme pro inputy referenci uvnitř formuláře.*/
            <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Email" type="email" className="loginInput" ref={email} required/>
            <input placeholder="Password" type="password" className="loginInput" ref={password} required/> </form> /*
        c4) ZPŘÍSTUPNÍME hodnotu inputu pomocí ref skrze .current.value PO submitu "Log In" */ 
            const handleClick = (e) => {
                e.preventDefault();
                console.log(email.current.value);   // tímto zpřístupníme hodnotu inputu po odeslání formuláře
            }; /*
    
    d) PRÁCE S CONTEXT API
        d1) INITIAL_STATE: v AuthContext.js NEJDŘÍVE INITIAL_STATE ve kterém budou iniciální hodnoty elementů s kterými budeme pracovat:*/ 
        const INITIAL_STATE = {
            user: null,       // nejsme před loginem přihlášeni => user = null;
            isFetching: false,  // isFetching určuje začátek/konec procesu => nejdříve je isFetching false, jelikož na začátku nefetchujeme data
            error: false      // nemáme žádné errory na počátku
        };/*
        d2) VYTVOŘÍME CONTEXT: pomocí importované metody "createContext()" do které VLOŽÍME INITIAL_STATE */
        import { createContext } from "react";
        export const AuthContext = createContext(INITIAL_STATE); /*

Co je to CONTEXT PROVIDER?
    - Veškeré komponenty které zabalíme do CONTEXT PROVIDERU budou moci přistupovat k všem položkám uložených v CONTEXTU.

        d3) VYTVOŘÍME CONTEXT PROVIDER: použijeme useReducer() HOOK do kterého vložíme "AuthContext" a "INITIAL_STATE" */
        // src/context/AuthContext.js
        export const AuthContextProvider = ({children}) =>{     // 1. children je to co wrapujeme - sem vložíme App.js komponentu
            const [state, dispatch] = useReducer(AuthContext, INITIAL_STATE);   // 2. použijeme HOOK useReducer()
            return( // 3. naše fce přijímá arg children (App.js) a vkládá tento arg do Provideru ve kterém se nastaví value hodnoty
                <AuthContext.Provider value={{user: state.user, isFetching: state.isFetching, error: state.error, dispatch}} > 
                    {children}  
                </AuthContext.Provider>        
            )
        }/*

        d4) WRAPOVÁNÍ <App /> v index.js: naimportujeme Providera a zabalíme do Provider <App /> komponentu. */
        import {AuthContextProvider} from "./context/AuthContext";
        ReactDOM.render(
        <React.StrictMode>
            <AuthContextProvider>
            <App />
            </AuthContextProvider>
        </React.StrictMode>,
        document.getElementById('root')
        );/*
HOTOVO: Nyní sdílíme všechny hodnoty z <AuthContext.Provider> s komponentu <App>, tyto hodnoty (values) jsou user, isFetching, error, dispatch

Jak funguje useReducer()?
        1) Nejdříve nastane LoginStart ACTION
            ACTION 1: 
                dispatch (odešli) LoginStart({
                    mail:john@gmail.com, 
                    pass: 123456})
        2) To vstoupí do reduceru kde dojde k UPDATE state, 
            ACTION 1 => REDUCER:
                INITIAL_STATE = { 
                    user:null, 
                    isFetching: false, 
                    error:false}
        3) Po UPDATĚ vypadá state nově takto
            ACTION 1 => REDUCER => UPDATE STATE:
                NEW_STATE = {
                    user: null, 
                    isFetching: true, 
                    error: false}
        4) Po vykonání ACTION_1 (LoginStart) provedeme LOGIN POST REQUEST na API => http://localhost:8800/api/auth/login (body requestu: {email:"a@a.cz", password: "123"}  )
            Současný state před POST requestem a získáním usera vypadá takto:
                ICURRENT_STATE = {
                    user:null,
                    isfetching:true,
                    error:false
                }

** VARIANTA NÍŽE POČÍTÁ S ÚSPĚŠNÝM POST REQUESTEM **
        5a) Po získání usera z MongoDB na z response POST requestu se vykoná ACTION 2:
            ACTION 2:
                dispatch (odešli) LoginSuccess({
                    username: john,
                    mail: john@gmail.com,
                    profilePicture: image.png,
                    coverPicture: cover.png,
                    followers: [],
                    followings: [],
                    isAdmin: false
                })
        6a) Tato akce vstoupí do Reduceru, kde dojde k UPDATE state a vznikne tím nový NEW_STATE s userem (pokud nenastal error):
            ACTION 2 (possiblity 1) => REDUCER => UPDATE STATE:
                NEW_STATE = {
                    user: {username: john, mail: john@gmail.com, profilePicture: image.png, coverPicture: cover.png, followers: [] ...},
                    isFetching: false,
                    error: false
                }

** VARIANTA NÍŽE POČÍTÁ S NEÚSPĚŠNÝM POST REQUESTEM => ERROR **
        ACTION 2 possibility 1 vychází z toho že LOGIN byl úspěnšný (tzn. nebyl error), další possiblity počítá s tím že nastal error.
        5b) Může se stát že LOGIN POST request bude neúspěšný a response bude error (např. user nenalezen).
            V tom případě se ICURRENT_STATE ze 4) změní a vykonná se ACTION 2 (possiblity 2)
            ACTION 2 (possilibty 2):
                dispatch (odešli) LoginFailure{error}
                - Po tomto dispatchi (odeslání) ACTION 2 (possilibty 2) vstouí do REDUCERU, kde dojde k UPDATE STATE a vznikne NEW_STATE:
            ACTION 2 (possilibty 2) => REDUCER => UPDATE STATE:
                NEW_STATE ={
                    USER: null,
                    isFetching: false,
                    error: true
                }

        *** NA ZÁKLADĚ PROCESŮ POPSANÝCH VÝŠE BUDEME MÍT V 3 RŮZNÝCH SOUBORECH KÓD PRO: CONTEXT, REDUCER, ACTIONS ***

e) IMPLMENETACE REDUCERU + ACTIONS + CONTEXT (useReducer())
    e1) Nejdříve uvnitř AuthActions.js nastavíme ACTIONS které jsme popsali v kapitole výše - JEDNÁ SE O AKCE KTERÉ MOHOU NASTAT.*/ 
        // AuthActions.js 
            export const LoginStart = (userCredentials) => ({ // 1) zde vstupuje objekt s přihlašovacími údaji usera: {"email": "john@gmail.com","password": "123456"}
                type: "LOGIN_START",
            });
            export const LoginSuccess = (user) => ({    // 2) zde vstupuje obj jež je v response POST LOGIN requestu v případě ÚSPĚCHU = {user}
                type: "LOGIN_SUCCESS",
                payload: user,  // 2a) tohoto usera vložíme do payload LoginSuccess a tento payload vložíme do REDUCERU
            });
            export const LoginFailure = (error) => ({   // 3) zde vstupuje obj jež je v response POST LOGIN requestu v případě NEÚSPĚCHU = {error}
                type: "LOGIN_FAILURE",
                payload: error  // 3a) tento error do payload LoginFailure a tento payload vložíme do REDUCERU
            });/*
    e2) Uvnitř AuthReducer.js vytvoříme REDUCER pomocí SWITCH A NASTAVÍME HODNOTY PRO KAŽDÝ PŘÍPAD ACTIONS.
        // AuthReducer.js */
            const AuthReducer = (state, action) => {    // do této fce vstupuje state a action, kdy PLATÍ ŽE action === dispatch
                switch(action.type){    // action.type je to co jsme nastavili v AuthActions (např. type: "LOGIN_START")
                    case "LOGIN_START":
                        return {
                            user: null,
                            isFetching: true,
                            error: false,
                        };
                    case "LOGIN_SUCCESS":
                        return {
                            user: action.payload,   // zde nastavujeme usera na obj který jsme v AuthContext.js vložili do payload = user z response LOGIN REQUESTU
                            isFetching: false,
                            error: false,
                        };     
                    case "LOGIN_FAILURE":
                        return {
                            user: null,   
                            isFetching: false,
                            error: action.payload,  // pokud bude FAILURE tak uložíme do error response z request = action.payload
                        };    
                    default:
                        return state;
                }
            };        
            export default AuthReducer;/*
    e3) Uvnitř AuthContext.js vytoříme const [state, dispatch] (podobně jako [state, setState]) z useReducer HOOKu.
            Do argumentů HOOKu useReducer() vkládáme jako 1. arg náš REDUCER (kde je SWITCH/case kód) a jako 2. arg INITIAL_STATE.
                - REDUCER = AuthRecuder*/ 
            //AuthContext.js
                import { createContext, useReducer } from "react";
                import AuthReducer from './AuthReducer';            
                const INITIAL_STATE = { 
                    user: null,       // nejsme před loginem přihlášeni => user = null;
                    isFetching: false,  // isFetching určuje začátek/konec procesu => nejdříve je isFetching false, jelikož na začátku nefetchujeme data
                    error: false      // nemáme žádné errory na počátku
                };
                export const AuthContext = createContext(INITIAL_STATE);    // vytvoříme si context pomocí createContext()
                export const AuthContextProvider = ({children}) =>{ // pokud je <App> zabalen v Provideru => children = <App> komponenta
                    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE); // 1. arg = REDUCER, 2. arg = INITIAL_STATE
                                 // dispatche máme 3 - viz AuthActions.js a jsou podobné jako setState
                    return(
                        // Níže předáváme state data společně s dispatch do <App> komponenty, abychom mohli s těmito daty v <App> pracovat
                        <AuthContext.Provider value={{user: state.user, isFetching: state.isFetching, error: state.error, dispatch}} >  
                            {children}  {/* = <App> */}
                        </AuthContext.Provider>        
                    )
                }/*
f) API CALLS - NOVÝ SOUBOR apiCalls.js (v /src) KDE VYUŽIJEME KÓD VÝŠE.
    f1) Nejdříve uvnitř apiCalls.js BUDEME ODESÍLAT 1. AKCI => DISPATCH ACTION 1 (LOGIN_START)
    f2) Následně provedeme AKCI 2 a upravíme dispatch v závislosti na tom zda bude success (posibility 1), nebo error (posiblity 2)*/
        // apiCalls.js
        import axios from "axios";
        const api = process.env.REACT_APP_DEV_BASE_URL;
        export const loginCall = async (userCredential, dispatch) => {
            dispatch ({type: "LOGIN_START"});  // ACTION 1 = "LOGIN_START"
            try{
                const res = await axios.post(`${api}auth/login`, userCredential); //BE vrátí v response {user} na základě userCredential = success
                dispatch ({type: "LOGIN_SUCCESS", payload: res.data}); // ACTION 2 (possiblity 1) = "LOGIN_SUCCESS" => payload nastavíme na response
            } catch(err){
                dispatch ({type: "LOGIN_FAILURE", payload: err}); // ACTION 2 (possiblity 2) = "LOGIN_FAILURE" => payload nastavíme na error
            }
        }/*
g) VOLÁNÍ API CALLS v Login.jsx => loginCall() => dispatch (A1, A2_pos1, A2_pos2) => AuthContext => useReducer(AuthReducer)
    g1) Naimportujeme fci loginCall z apiCalls.js výše. */
        import { loginCall } from "../../apiCalls";/*
    g2) App.js (rodič Login.jsx) je zabalen v AuthContext.Provider A MÁ PŘÍSTUP k datům, použijeme useContext HOOK k získání dat (dispatch, user, isFetching, error) */
        const { user, isFetching, error, dispatch } = useContext(AuthContext); /* <Login> má přístup k tomuto CONTEXTU rodiče App.js skrze useContext()
    g3) Provedeme loginCall() uvnitř handleClick() */
        const handleClick = (e) => {
            e.preventDefault();
            loginCall({ email: email.current.value, password: password.current.value }, dispatch);// email a password máme pomocí useRef() Z INPUTU
         };/*
    g4) Pro kontrolu se budeme snažit přistoupit k objektu user z kontextu do CONDOLE.LOG()*/
        console.log(user); /* => získáme tím obj usera na základě emailu & hesla

HOTOVO: NYNÍ MÁME OBJEKT USERA Z DATABÁZE SE VŠEMI JEHO VLASTNOSTMI NA ZÁKLADĚ LOGINU!!!

h) VYUŽITÍ isFetcing KE KONDIČNÍMU RENDEROVÁNÍ TEXTU: "Loading" / "Log In"*/
    // Login.jsx
    <button className="loginButton">   
        {isFetching ? "Loading" : "Log In"} 
    </button>/*

i) POUŽITÍ MATERIAL-UI K ZOBRAZENÍ NAČÍTACÍHO KOLEČKA NAMÍSTO TEXTU "Loading"
    Dokumentace: https://mui.com/material-ui/getting-started/installation/ 
    i1) Instalace Material-UI: 
        npm install @mui/material @emotion/react @emotion/styled
    i2) Nalezení v dokumentaci loading kolečka a naimportování do Login.jsx*/
        import { CircularProgress } from "@material-ui/core"; /*
    i3) KONDIČNÍ použití namísto "Loading" */
        // Login.jsx
        <button className="loginButton">
            {isFetching ? <CircularProgress color="white" size="30px" /> : "Log In"}
        </button>/*
    i4) To samé použijeme pro "Create a New account" button aby user nemohl na tento button kliknout během načítání / fetchování */ 
        // Login.jsx
        <button className="loginRegisterButton">
            {isFetching ? <CircularProgress color="white" size="30px" /> : "Create a New account"}              
        </button> /*
    i5) Nastylujeme cursor aby nešlo klikat na button během fetchování, tzn. cursor je disabled */
        // Login.jsx
        <button className="loginButton" type="submit" disabled={isFetching}/>
        // login.css
        .loginButton:disabled{
            cursor: not-allowed;
        }
    }/*

j) AUTOMATICKÉ PŘESMĚROVÁNÍ USERA NA ZÁKLADĚ TOHO ZDA JE PŘIHLÁŠEN/NEPŘIHLÁŠEN 
    j1) Uvnitř App.js naimportujeme Navigate, useContext & AuthContext */ 
        import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
        import { useContext } from 'react';
        import { AuthContext } from './context/AuthContext'; /*
    j2) Načteme usera z CONTEXTU */
        const {user} = useContext(AuthContext); /*
    j3) Uvnitř <Route> KONDIČNĚ NASTAVÍME PŘESMĚROVÁNÍ UŽIVATELE / RENDEROVÁNÍ KOMPONENTY => NA ZÁKLADĚ TOHO ZDA EXISTUJE USER V CONTEXTU */
        <Routes>
            <Route exact path="/" element={user ? <Home/> : <Register/>}/>{/* Pokud existuje user => JE PŘIHLÁŠEN => PŘESMĚRUJEME NA <Home/> */}
            <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>}/> {/* Pokud existuje user => JE PŘIHLÁŠEN => PŘESMĚRUJEME NA <Home/> */}
            <Route path="/register" element={user ? <Navigate to="/"/> : <Register/>}/> {/* Pokud existuje user => JE PŘIHLÁŠEN => PŘESMĚRUJEME NA <Home/> */}
            <Route path="/profile/:username" element={<Profile/>}/>
        </Routes>
/*
HOTOVO: DOKÁŽEME PRACOVAT S PŘIHLÁŠENÍM USERA PO LOGINU!!!


J) REGISTER PAGE (form)
-------------------------------------------------------------------------
Uvnitř REGISTER chceme provést to samé co jsme provedli uvnitř LOGIN, tzn. nechceme aby po REGISTER user musel ještě provést LOGIN 
    => PO REGISTRACI BUDE USER AUTOMATICKY PŘIHLÁŠEN 
        => ZKOPÍRUJEME KÓD Z LOGIN.JSX do REGISTER.JSX

a) JAK ZKONTROLOVAT password === passwordAgain (kontrola hesla)
    a1) Kontrolu provedeme v metodě handleClick jež se vyvolá po submitu formuláře jež se vyvolá stiskem tlačítka jež má type="submit"
    a2) Zkontorluje .currentValue passwordAgain a password
    a3) VYTVOŘÍME VLASTNÍ VALIDACI pomocí .setCustomValidity() => tím se zobrazí námi zvolený text ve validačním okénku
PROBLÉM: Musíme 2x kliknout na submit k zobrazení validační zprávy v případě nesouhlasících hesel
    a4) ŘEŠENÍ: použíje .reportValidity() */
    // Register.jsx
    const handleClick = (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value) {
          password.current.setCustomValidity("Passwords do not match");
          password.current.reportValidity();
        }
      };/*
HOTOVO: KONTROLUJEME SPRÁVNOST HESEL

b) JAK REGISTROVAT USERA DO DATABÁZE A PŘESMĚROVAT NA LOGIN PAGE
    b1) vytvoříme objekt user{} s vlasnosti username, email, password (uvnitř else, v případě že password === passwordAgain)
    b2) uvnitř try/catch bloku uděláme axios.post request na API, do kterého vložíme objekt user{}
    b3) K přesměrování použijeme useNavigate HOOK a po korektním zadání údajů přesměrujeme usera na LOGIN PAGE*/
    // Register.jsx
    const API = process.env.REACT_APP_DEV_BASE_URL;
    const handleClick = async (e) => {
        e.preventDefault(); // a) JAK ZKONTROLOVAT password === passwordAgain (kontrola hesla)
        if (passwordAgain.current.value !== password.current.value) {
          password.current.setCustomValidity("Passwords do not match");
          password.current.reportValidity();
        } else {    // b) JAK REGISTROVAT USERA DO DATABÁZE A PŘESMĚROVAT NA LOGIN PAGE
          const user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
          };
          try {
            await axios.post(`${API}auth/register`, user);
            navigate("/login");
          } catch (err) {
            console.log(err);
          }
        }
    }; /*


K) ZPŘÍSTUPNĚNÍ USERA Z CONTEXT API K ZÍSKÁNÍ PROFILE PICTURE
------------------------------------------------------------------------
Budeme se snažit zpřístupnit usera z CONTEXT API nejdříve uvnitř komponenty Topbar.jsx
    - upravíme profile picture dynamicky dle usera v CONTEXT API

a) Nastavení PROFILE PICTURE v NAVBARU na základě usera z CONTEXT API */
    // Topbar.jsx
    const { user } = useContext(AuthContext);               // načtení z CONTEXTU
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;         // získání cesty k složce
    ... 
    <Link to={`/profile/${user.username}`}>                 {/* přesměrování usera na profile page daného usera */}
        <img
        src={
            user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
        />
    </Link>/*
HOTOVO: Na základě USERA jež je přihlášen nyní měníme profilový obrázek DÍKY CONTEXT API!!! 

b) Podobně nastavíme profilový obrázek díky CONTEXT API uvnitř komponenty Share.jsx */
// Share.jsx
export default function Share() {
    const { user } = useContext(AuthContext);
    ...
    <img className="shareProfileImg" src={ user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" />

/*
L) LIKE & DISLIKE 
-------------------------------------------------------------------------------------------------------
Doposud jsme nastavovali like/dislike na frontendu a změny se neukládali do databáze - to chceme změnit.

Uvnitř api/routes/posts.js máme naprogramovanou BE metodu jež dělá call na server - viz níže. */
router.put("/:id/like", async (req, res) => { /* do url musíme tedy vložit ID postu abychom ho v BE likenuly.

Co musíme odeslat na BE server pokud chceme příspěvek likenout?
    - id usera který dává like
    - id postu který likujeme

a) Uvnitř Post.jsx z CONTEXTU načteme současného usera.*/
    // Post.jsx
    import { AuthContext } from "./../../context/AuthContext";
    const { user: currentUser } = useContext(AuthContext); /*

b) Uvnitř Post.jsx naprogramujeme likeHandler aby vykonal route na server
    b1) Jelikož se jedná o asynchronní operaci, tak musí být call API route v try/catch bloku
    b2) Předáme do likeHandleru post._id a userId abychom identifikovali likenutý post a zároveň uživatele kým je likenutý.*/
    const likeHandler = () => {
    try {
      axios.put(API + "posts/" + post._id + "/like", {
        userId: currentUser._id.$oid,
      });
    } catch (err) {} /*

PROBLÉM: Když likneme již disliknutý POST tak nám server vrátí zprávu "POST HAS BEEN DISLIKED" - ačkoliv jen znovu likujeme.
REŠENÍ: Budeme kontrolovat zda daný post obsahuje v poly likes[] stejné userId => tím zjistíme zda uživatel již likoval / nelikoval.

c) Nastavíme kondičně isLiked na true/false v závislosti na tom zda v databázi má post uložený like od uživatele
    c1) použijeme useEffect HOOK
    c2) nastavíme v useEffect HOOKu závislosti, aby se stav isLiked přenastavil v momentě kdy se změní id usera, nebo likenutí postu */
// Post.jsx
useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id)); // true = post je likenutý akt. userem | false = post není likenutý akt. userem
}, [currentUser._id, post.likes]);  /* ZÁVISLOST: pokud se změní hodnota currentUser._id nebo post.likes tak se HOOK vykoná znovu

HOTOVO: NASTAVUJEME STATE IsLiked U POSTŮ PRO KAŽDÉHO PŘIHLÁŠENÉHO UŽIVATELE ZVLÁŠŤ => LIKENUTÍ / DISLIKNUTÍ SE PROJEVÍ V DATABÁZI.


M) VYTVOŘENÍ NOVÉHO PŘÍSPĚVKU (se souborem) - "CREATE POST" REQUEST
---------------------------------------------------------------------------------------------------------
Vytvoření nového příspěvku na sociální síti bude nabízet možnost přidat text, nebo obrázek.
 => z toho důvodu vytvoříme pomocí useRef HOOKu referenci na input kde je text.
    
a) Načtení textu z inputu */
    const desc = useRef();
    <input placeholder={"What's in your mind " + user.username + "?"} className="shareInput" ref={desc} /> /*
        => DÍKY TOMU ULOŽÍME INPUT IHHNED DO STATE (do const "desc")
    
JAK NAČÍST SOUBOR (fotku) Z ADRESÁŘE PC DO STATE?
    1. vytvořit <input type = "file"> */
        <input type = "file"/>/*
    2. vytvořit state pomocí HOOKU useState (const [file, setFile] = useState()) */
        const [file, setFile] = useState(); /*
    3. nastavit onChange atribut aby na základě eventu došlo k změně state file na vybraný soubor
        - k vybrání pouze jednoho souboru musíme přistoupit k prvnímu elementu files => e.target.files[0] */
        <input type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e) => setFile(e.target.files[0])} /> /*
            - onChange vznikne např. zvolením souboru - nastavíme state file pomocí setFile na 1. element pole vybraných souborů

PROBLÉM: Vytvořili jsme nový input a chceme skrýt tlačítko aby nebylo zobrazeno a zachovat ikonu "Photo or Video" pro výběr souborů.
ŘEŠENÍ: Vytvoříme label a pomocí atributu htmlFor nastavíme napojení na <input type="file"/> 

b) Načtení souboru do state */
<label htmlFor="file" type="file" className="shareOption">  {/* pomocí htmlFor bude label propojen s buttonem: klik na label = klik na button */}
    <PermMedia htmlColor="tomato" className="shareIcon" />
    <span className="shareOptionText">Photo or video</span> 
    <input style={{ display: "none" }} type="file" id="file" accept=".png, .jpeg, .jpg" onChange={(e) => setFile(e.target.files[0])} />
        {/* díky našemu propojení labelu na button můžeme zakrýt input skrze display: "none" a zachová se pouze klikání na label */}
</label> /*

c) SUBMIT event handler
    c1) Nastavíme tlačítko uvnitř form kde se posílá nový příspěvek aby bylo SUBMIT
    c2) Uvnitř form nastavíme submit aby zavolal event handler "submitHandler"
    c3) Uvnitř submitHandler vytvoříme nový objekt příspěvku a tento nový objekt odešleme na server */
    <form className="shareBottom">
    <div className="shareOptions" onSubmit={submitHandler}>  </form>
         const submitHandler = async (e) => {
            e.preventDefault();
            // vytvoříme nový objekt post
            const newPost = {
            userId: user._id,
            desc: desc.current.value, // získáváme z useRef
            };
            // tento nový objekt odešleme pomocí axios.get na API
            try {
            await axios.post(`${API}posts`, newPost);
            } catch (err) {}
      /*

JAK UPLOADOVAT OBRÁZKY (skrze jaké služby) - DOPORUČENÍ:
    - AMAZON S3
    - FIREBASE
    - nějaký CDN nástroj

*** SOUBORY NYNÍ BUDEME UKLÁDAT DO NAŠÍ SLOŽKY API (představuje server) => TOTO BY SE SPRÁVNĚ NEMĚLO DĚLAT - JEDNÁ SE O BAD PRACTICE! ***
    - PROČ BY SE SOUBORY NEMĚLI UKLÁDAT DO NAŠEHO API? => REST API by mělo mít jen požadavky.

d) Nastavíme UPLOAD obrázků do našeí složky API (BAD PRACTICE)
    d1) V console vlezeme do /api a napíšeme následující příkaz: npm add multer path
        - CO JE TO MULTER? => Multer je Node.js Middleware k nahrávání souborů

INSTALACE MULTER: npm i multer        

    d2) V /api index.js naimportujeme a implementujeme multer. */
        const multer = require("multer");
        const upload = multer(); /* DŮLEŽITÉ: zde ještě musíme nastavit CÍLOVOU ADRESU (DESTINATION) & NÁZEV SOUBORU (FILE NAME)
    d3) Vytvoříme nový POST request jež zahrnuje Multer */
        app.post("api/upload", upload.single("file"), (req,res) =>{
            try{
            return res.status(200).json("File uploaded successfully.")
            }catch(err){
            console.log(err);
            }
         }); /*
    d4) SPECIFIKUJEME NÁZEV SOUBORU A CÍLOVOU ADRESU SOUBORU uvnitř const storageEngine.
         - nejdříve nastavíme destination:
         - následně nastavíme filename: */
        const storageEngine = multer.diskStorage({
            destination:(req,file,cb)=>{ // cb = callback fce
              cb(null, "public/images");
            },
            filename:(req,file,cb) => {
              cb(null, req.body.name);  // name budeme odesílat z clienta uvnitř těla requestu
            }
          }); /*
    d5) Vložíme objekt z storageEngine do Multeru. */
        const upload = multer({storage: storageEngine}); /*

e) SIMULACE NAHRÁNÍ SOUBORU V POSTMAN 
    e1) vložíme odkaz na základě app.post("/api/upload") na http://localhost:8800/api/upload
    e2) uvnitř body vyberem form-data
    e3) DŮLEŽITÉ: název souboru zvolíme stejně jako jsme specifikovali zde - upload.single("file") => název souboru === "file"

*** DŮLĚŽITÉ HOTOVO: NYNÍ NAHRÁVÁME SOUBOR NA SERVER POMOCÍ KNIHOVNY MULTER ***********

K NAHRÁNÍ SOUBORU NA SERVER JE TŘEBA:
    - nainstalovat multer: npm i multer
    - vytvořit storageEngine a vložit do upload (const upload = multer({ storage: storageEngine }))
    - vytvořit post request 

f) Přesun souborů z lokálního uložiště na uložiště serveru
    - doposud jsme měli složku public v clientu - přesuneme její obsah do public/assets
    - změníme v .env u clienta cestu (REACT_APP_PUBLIC_FOLDER = http://localhost:8800/images/)
    - ZPŘÍSTUPNÍME NA ODKAZE pomocí implementace "path": */
        app.use("/images", express.static(path.join(__dirname, "public/images"))); /*
        - TOTO ŘÍKÁ: Nedělej žádný request, pouze zpřístupni tento soubor.
          => Díky kódu výše můžeme zpřístupnit soubor na serveru (jinak by REST API nativně vykonalo nějaký request, ale tímto ho rušíme)

HOTOVO: Nyní můžeme soubory na server jak uložit - TAK I ZPŘÍSTUPNIT!!! 

g) IMPLEMENTACE PŘIDÁNÍ NOVÉHO PŘÍSPĚVKU SE SOUBOREM v Share.jsx
    g1) V submitHandleru zkontrolujeme zda byl do Share komponenty vložem soubor 
        - to zjistíme tak, že zkontrolujeme máme ve state "file"
        - "file" bude ve state pouze v případě že byl kliknut <input> => vybrán soubor => díky onChange atributu zavolán setFile(...)
    g2) PŘIDÁME SOUBOR ZE STATE DO FORMULÁŘE
        - vytvoříme nový objekt data = FormData (objekt formuláře)
        - ROZŠÍŘÍME data o FILE & FILENAME (datum + originální filename) 
    g3) Přidáme do newPost objektu který posílám na server název souboru do atributu img:
        - v MongoDB máme pro Post atribut img, který specifikuje název souboru abychom ho mohli zpřístupnit */
    // Share.jsx
    const submitHandler = async (e) => {
        e.preventDefault();
        const newPost = {
          userId: user._id.$oid,
          desc: desc.current.value, // získáváme z useRef()
        };
        if (file) {
          const data = new FormData(); 
          const fileName = Date.now() + "-" + file.name;
          data.append("file", file);      // přidáváme soubor ze state
          data.append("name", fileName);  // .name zde nastavíme a zpřístupníme ho v API (index.js/api): {cb(null, req.body.name);}
          newPost.img = filename;         // nastavujeme atribut objektu {post} do MongoDB
          // UPLOAD SOUBORU
          try {
            await axios.post(`${API}upload`, data);
          } catch (err) { 
              console.log(err) 
          }
        } 
        // API => MongoDB
        try {
            await axios.post(`${API}posts`, newPost);
            window.location.reload();   // obnovení stránky po nahrání souboru
        } catch (err) {}
         };/*

TOTO JE VELMI DŮLEŽITÉ: 
    Paralelně se dějí 2 věci pokud je zvolen soubor:
      1) Tvorba {newPost} => doplnění dat ze state (tam jsou data z inputů) => POST req na "api/posts"
      2) Tvorba obj {new FormData()} => doplnění dat ze state (z "file" inputu) => doplnění atributu img {newPost} => POST "api/upload"

*** HOTOVO:
        VYTVÁŘÍME OBJEKT PŘÍSPĚVKU {POST} 
            => ODESÍLÁME OBJEKT {POST} NA API A DO DATABÁZE
                => ODESÍLÁME SOUBOR VLOŽENÝ V KOMPONENTĚ SHARE NA SERVEROVÉ ULOŽIŠTĚ
                    => REFRESHUJEME STRÁNKU A ZOBRAZUJEME NOVÝ PŘÍSPĚVEK I SE SOUBOREM NA FEEDU

PROBLÉM: POST se neobjevuje na začátku FEEDU

i) Seřazení POSTŮ ve Feedu aby nejnovější byl první
    i1) Uvnitř Feed.jsx použijeme metodu .sort() */
    // Feed.jsx
        setPosts( // setPost() se vykonává uvnitř useEffect() v Feed.jsx a získáváme zde z API data do state
            res.data.sort((p1, p2) => {
            return new Date(p2.createdAt) - new Date(p1.createdAt); // nedřívější bude první, prohozením p1 a p2 by to bylo naopak
            })
         );/*


N) ZÍSKÁNÍ PŘÁTEL UŽIVATELE Z REST API (Fetching user friends from REST API)
-------------------------------------------------------------------------------------
V Profile.jsx posíláme {user} do komponenty <Rightbar> kde máme seznam přátel.
    - {user} získáme ze serveru na základě názvu uživatele v URL => vytváříme get požadavek a výsledek ukládáme pomocí setUser() do {user}

a) Uvnitř "api/users.js" Vytvoříme novou API route, která získá všechny followery uživatele
        - od sledovaných uživatelů budeme pouze získávat následující data: username, userId, img
    a1) Uvnitř této route vyhledáme nejdříve usera na základě userId v url (req.params.userId)
    a2) Vytvoříme pole přátel (díky Promise.all) a to získáme tím, že získáme od usera id přátel které sleduje (friendId) a na základě friendId najdeme objekt usera.
    a3) K získání atributů které nás zajímají (username, userId, img) použijeme DESTRUCTURING a pushneme atributy do nové proměnné friendList 
    a4) V response vrátíme pouze proměnnou friendList, která obsahuje atributy uživatel jež user s userId z URL sleduje. */
    //get friends
    router.get("/friends/:userId", async (req, res) => {
        try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
            return User.findById(friendId);
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
        });
        res.status(200).json(friendList)
        } catch (err) {
        res.status(500).json(err);
        }
    }); /*

HOTOVO: Máme skrze route pole atributů uživatelů, které user s daným userId sleduje.
    - Můžeme zpřístupnit usera s daným userId pomocí GET requestu na http://localhost:8800/api/users/friends/624350a8df288254db35b02d

b) Zavoláme API Route uvnitř "Rightbar.js" a získáme friendList uvnitř useEffect hooku. 
    b1) Výsledek z get requestu uložíme do state který založíme */
    // Rightbar.jsx 
      useEffect(() => {
        // zakládáme takto fci jelikož useEffect nemůže být async
        const getFriends = async () => {
          try {
            const friendList = await axios.get("/users/friends/" + user._id); // vkládáme id přihlášeného usera do URL
            setFriends(friendList.data); // výsledek vkládáme do state (iniciálně je state prázdné pole)
          } catch (error) {
            console.log(error);
          }
        };
        getFriends(); 
      }, [user._id]); /* dependency/závislost = user._id - při změně user._id by se měl znovu vykonat useEffect a provést znovu GET požadavek/*

c) DYNAMICKY VYRENDUREJEME KOMPONENTY, tak ať zobrazují data z pole friends ze state => pole projdeme pomocí MAPOVÁNÍ */
    // Rightbar.jsx
    <div className="rightbarFollowings">
     {friends.map((friend) => (
        <div className="rightbarFollowing">
            <img src= { friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png" } className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">{friend.username}</span>
        </div>
     ))}
    </div> /*

d) Nastavíme aby friend.profilePicture byl CLICKABLE a dostali jsme se tím na jeho profil. */ 
    // Feed.jsx
    <Link to={"/profile/" + friend.username} style={{ textDecoration: "none" }}>
        <div className="rightbarFollowing">
            ...
        </div>
    </Link> /*

e) Odstraníme Share komponentu z FEEDU pokud klikneme na profil přítele (friend profile) */ 
    // Feed.jsx
        // PŘED:
        <div className="feedWrapper">
            <Share />
        </div>
    
        // PO:
        <div className="feedWrapper">
            {username === user.username && <Share />}
        </div> /*




O) PŘIDÁNÍ A ODEBRÁNÍ PŘÍTELE (FOLLOW & UNFOLLOW A USER)
--------------------------------------------------------------------------------
a) Nastavíme logiku tak, aby se zobrazilo tlačítko na FOLLOW/UNFOLLOW pouze v případě že profil usera SE NEROVNÁ navštívenému profilu. */
    //Rightbar.jsx
    const ProfileRightbar = () => {
        return (
        <>
            {user.username !== currentUser.username && (
            <button className="rightbarFollowButton" onClick={handleClick}>
                Follow <Add />{" "}
            </button>
        ) /*

b) Vytvoříme EVENT HANDLER pro kliknutí na tlačítko Follow výše.
    b1) Musíme rozlišovat 2 stavy:
        1) FOLLOWED - po kliknutí v handleClick se vykoná požadavek na server k Unfollowování a přerenderuje se btn na text "UNFOLLOWED"
        2) UNFOLLOWED - po kliknutí v handleClick se vykoná požadavek na serve k Followování a přerenderuje se btn na text "FOLLOWED"

    b2) Na základě těchto 2 stavů budeme komponentu kondičně renderovat <Button> PRO FOLLOW a jeho obsah. */
    // Rightbar.jsx
    const [followed, setFollowed] = useState(false);
    ... 
    useEffect(() => {
        // sleduje currentUser daného usera z profilu?
        // true: followed = true | false: followed = false
        setFollowed(currentUser.followings.includes(user?._id));
      }, [currentUser, user]);
    ... 
    const ProfileRightbar = () => {
        return (
          <>
            {user.username !== currentUser.username && (
              <button className="rightbarFollowButton" onClick={handleClick}>
                {followed ? "Unfollow" : "Follow"}
                {followed ? <Remove /> : <Add />}
              </button>
            ) /*

c) POUŽIJEME CONTEXT pro "FOLLOW" (userId) uvnitř AuthActions.js
    c1) V "AuthActions.js" vytvoříme akci Follow do které vstupuje userId => Tato akce bude type "FOLLOW" a payload (náklad) bude userId

Když to budeme dispatchovat tak přijememe userId v AuthActions.js a předáme ho do REDUCERU v AuthReducer.js
    => z AuthActions.js bude userId vstupovat jako PAYLOAD do AuthReducer.js 

    c2) V "AuthReducer.js" vytvoříme nový CASE "FOLLOW" uvnitř kterého vrátíme stejný state i usera, jen s přidaným followerem. */
    case "FOLLOW":
        return {
            ...state, // = kopírování state / spreading the INITIAL STATE
            user: {
                ...state.user, // = kopírování usera / spreading the user
                followings: [...state.user.followings, action.payload] // = kopírování followings + PŘIDÁNÍ NOVÉHO userId (payload = userId)
            }
        }; /*

d) TO SAMÉ JE POTŘEBA PRO UNFOLLOW:

d1) Nastavení UNFOLLOW action (fci) uvnitř AuthActions.js  */
    //AuthActions.js
    export const Follow = (userId) => ({
        type:"UNFOLLOW",
        payload: userId
    });  /*
    
d2) Nastavíme UNFOLLOW case uvnitř AuthReducer.js (logika akce jak se upraví pole followings po kliknutí na "UNFOLLOW")
    - bude se velmi podobat case "FOLLOW" s tím rozdílem že ze seznamu follwings userovy ODEBEREME dané userId (které je uvnitř payload)
    => POUŽIJEME .filter(): */ followings: state.user.followings.filter(following => following !== action.payload)
    //AuthActions.js
    case "UNFOLLOW":
        return {
            ...state, // = spreading the INITIAL STATE,
            user: {
                ...state.user,
                followings: state.user.followings.filter(following => following !== action.payload)
            }
        };/*

d3) Vykonáme dispatch() uvnitř Rightbar.jsx abychom vyvolali kód / akci výše. */
        if (followed) {
            await axios.put("/users/" + user._id + "/unfollow", {
            userId: currentUser._id,
            });
            dispatch({ type: "UNFOLLOW", payload: user._id });
            /*

DŮLEŽITÉ: Když provádíme follow/unfollow tak měníme data na 2 místech:
            1) Měníme data ve STATE - STATE máme uložen v Contextu takže měníme CONTEXT objektu user => TO SE PROVÁDÍ UVNITŘ AuthActions.js*/
                // AuthActions.js
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(following => following !== action.payload)
                }/*
                VOLÁNÍ KÓDU VÝŠE (v AuthAction.js) PROVÁDÍME SPOLEČNĚ SE ZMĚNOU DAT NA SERVERU - viz níže.
            2) Měníme data na serveru (v databázi) - to provádíme pomocí AXIOS požadavků => to se provádí v kódu uvnitř Rightbar.jsx */
                // Rightbar.jsx     
                const { user: currentUser, dispatch } = useContext(AuthContext);  // načtení dat z Contextu
                const handleClick = async () => {
                    try {
                      if (followed) {
                        await axios.put("/users/" + user._id + "/unfollow", {   // ZMĚNA DAT NA SERVERU
                            userId: currentUser._id.$oid    // DŮLEŽITÉ: $oid
                        });
                        dispatch({ type: "UNFOLLOW", payload: user._id });   // VOLÁNÍ KÓDU PRO ZMĚNU DAT V STATE CONTEXTU
                      } else {
                        await axios.put("/users/" + user._id + "/follow", {     // ZMĚNA DAT NA SERVERU
                            userId: currentUser._id.$oid    // DŮLEŽITÉ: $oid
                        });
                        dispatch({ type: "FOLLOW", payload: user._id });     // VOLÁNÍ KÓDU PRO ZMĚNU DAT V STATE CONTEXTU
                      }
                    }/*

HOTOVO: Nyní se při kliknutí na FOLLOW provede změna ve state a na serveru - viz výše.
Dále se změní text tlačítka Follow - to se provádí pomocí kódu níže. */
    useEffect(() => {
       setFollowed(currentUser.followings.includes(user?._id)); //Tímto získáme status z databáze a kondičně vyrenderujeme "FOLLOW"/"UNFOLLOW"
    }, [currentUser, user]); /*




P) ZOBRAZENÍ NÁHLEDU OBRÁZKU PŘED UPLOADEM NA TIMELINE
-------------------------------------------------------------------------------------
Použijeme .createObjectURL abychom si vytvořili PSEUDU URL, skrze které si budeme moci zobrazit náhled obrázku. */
// Share.jsx
const [file, setFile] = useState(null);
{file && (
    <div className="shareImgContainer">
      <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
      <Cancel className="shareCancelImg" onClick={() => setFile(null)} />   {/* Tímto smažeme ze state file */}
    </div>
  )}
/*


APLIKACE DOKONČENA - POKRAČOVÁNÍ: CHATBOX

.env soubory doplnit o :
    client
    GENERATE_SOURCEMAP=false
    WDS_SOCKET_PORT=443

    api
    WDS_SOCKET_PORT=443

---------------------------------------------------- CHATBOX ---------------------------------------------------------------
Vytvoříme si stránku: Messenger.jsx,
Vytvoříme si komponenty: Message.jsx, Conversation.jsx
Nastylujeme si dle videa vizuální podobu chatu

Q) CHATBOX - TVORBA UI DESIGNU
---------------------------------------------------------------------------
a) VIEW: Zobrazování zpráv a rozlišení zda jsou odemně nebo od přítele.
    a1) Budeme si předávat do komponenty Message.jsx PROPS {own}. Díky tomu určíme zda je message naše, nebo přítele. */
        export default function Message({ own }) {/*
    a2) Tento props own použijeme jako className k .messagge => <div className="message own"></div>
    a3) Nastylujeme .message.own aby byl text zprávy na 2. straně a měl jinou barvu. */
        .message.own{ align-items: flex-end; }
        .message.own .messageText{ background-color: rgb(241, 238, 238); color: black; } /*
    a4) NASTAVÍME KONDIČNÍ className na základ {own} PROPS */
        <div className={own ? "message own" : "message"}></div> /*
    a5) Uvnitř Messenger budeme svou vlastní message nastavovat pomocí property own=true - viz níže. */
        <Message own={true} />/*

b) INPUT: Napsání zprávy do textového pole.
Dolní komponenta bude obsahovat text-area + button. K oddělení text-area a button použijeme justify-content: space-between.

PROBLÉM: Když máme hodně zpráv, tak se stane overflow a náš input je posunut dolů za zprávy.
ŘEŠENÍ: Nastavíme si overflow u <div className="chatBoxTop"/> uvnitř komponenty <Messenger>, resp. uvnitř messenger.css

c) Nastavení overflow: Wrapper: display:flex; flex-direction: column; => Child: height: 100%; overflow-y: scroll*/
    // Messenger.jsx - takto vypadají komponenty které přetékají
    <div className="chatBoxTop">
        <Message />
        <Message own={true} />
        <Message />
        <Message />
    </div>    /*
    c1) Nastylujeme chatBoxTop a nastavíme height na 100% a overflow-y: scroll.  */
        .chatBoxTop{
            height: 100%;
            overflow-y: scroll;
        }/*
    DŮLEŽITÉ: KÓD VÝŠE NEBUDE FUNGOVAT POKUD NENASTAVÍME DO RODIČOVSKÉHO DIVU / WRAPPER = .chatBoxWrapper      
    */
        .chatBoxWrapper{
            display: flex;
            flex-direction: column;
        } /*

d) Nastavení zeleného kolečka online = ONLINE BADGE uvnitř "ChatOnline.jsx" & "chatOnline.css"
Nastavíme pro ImgContainer position relative a pro badge position absolute. */
.chatOnlineImgContainer{
    position: relative;
}
.chatOnlineBadge{
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: lime;
    top: 2px;
    right: 2px;
} /*


R) BE: REST API CHATBOX - NAPOJENÍ NA API => ZÍSKÁVÁNÍ A ODESÍLÁNÍ ZPRÁV NA SERVER
-------------------------------------------------------------------------------- 
Vytvoříme 2 nové modely uvnitř API (již máme Post.js a User.js):
    1) Conversation model - každý userId bude mít své relace konverzací
    2) Message model - v každé konverzaci budou zprávy

Vytvoříme 2 nové routes - viz výše.

S) BE: VYTVOŘENÍ KONVERZACE (RELACE KONVERZACÍ)
--------------------------------------------------------------------------
    routes/conversation:
        a) new conv
        b) get conv of a user

a) NEW CONV: ULOŽENÍ NOVÉ KONVERZACE - conversation ROUTE: POST */
    router.post("/", async (req,res) =>{
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId] // z těla POST požadavku zjistíme id odesílatele a příjemce
        });
        try{
            const savedConversation = await newConversation.save(); 
            res.status(200)
        } catch(err){
            res.status(500).json(err)
        }
    }); /*>
    Test ROUTE - nyní když přistoupíme na route /conversation, tak se vykonná POST request a uvnitř těla bude senderId a receiverId.
    PROBLÉM: Nepřidali jsme Route do index.js - tudíž nám nebude fungovat */
    // ŘEŠENÍ:
    const conversationRoute = require("./routes/conversations");
    app.use("/api/conversations", conversationRoute); /*
    a1) TEST ROUTE - postman:
        Zašleme na http://localhost:8800/api/conversations JSON OBJEKT uvnitř těla níže:
            {
                "senderId": "624377f73169ef0c85fc68d1",
                "receiverId": "624378023169ef0c85fc68d3"
            }
        => HOTOVO - VŠE OK
    ERROR: "throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))"
    DŮVOD: NEEXPORTUJEME ROUTE NA KONCI SOUBORU.¨

    WORKFLOW VYTVÁŘENÍ NOVÉ KONVERZACE:

POST REQUEST s daty v req.body => Přečtení dat z req.body v ROUTE api/conversations => Vložení do MongoDB modelu a .save() => uložení na server

b) GET CONV: NAČTENÍ KONVERZACE díky userId - ROUTE: GET
Jak vyhledávat elementy v MongoDB?
    - $in: The $in operator selects the documents where the value of a field equals any value in the specified array. 

    conversations.js: */
    router.get("/:userId", async(req,res)=>{
        // pomocí $in vyhledáme pouze konverzace ve kterých je userId členem
        try {
            const conversation = await Conversation.find({
                members: {$in:[req.params.userId]}  
            });
            res.status(200).json(conversation);
        } catch (err) {
            res.status(500).json(err);
        }
    }); /*

T) BE: VYTVOŘENÍ MESSAGES (načtení zpráv v konverzaci)
---------------------------------------------------------------------------
    routes/messages:
        a) add new message
        b) get message of a user

V message route při "add message" vložíme do postu celé tělo body requestu
    => tzn. že body musí obsahovat položky níže:
        - conversationId
        - sender
        - text.
    viz níže: */
    {
        "conversationId":"6289fbce49e8a45743252532",
        "sender":"624377f73169ef0c85fc68d1",
        "text":"I like chicken meat."
    } /*

a) ADD NEW MESSAGE - přidání nové zprávy. */ 
router.post("/", async (req,res)=>{
    const newMessage = new Message(req.body);
    try {
        const savedMessage = await newMessage.save(); //uložíme celé tělo req.body do mongoDB - req.body bude obsahovat co potřebuje model Message
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err);
    }
}); /*

b) GET A MESSAGE - získání zprávy na základě conversationId. */
router.get("/:conversationId", async(req,res) =>{
    try{
        // Níže si nastavujeme podmínku: vyhledej všechny zprávy v MongoDb kde conversationId v URL === conversationId v MongoDB
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch(err){
        res.status(500).json(err);
    }
}); /*

HOTOVO - MÁME HOTOVÉ REST API PRO KONVERZACE A ZPRÁVY - UMÍME JAK VYTVÁŘET TAK ZÍSKÁVAT => NYNÍ BUDEME FETCHOVAT DO KLIENTA


U1) FE: FETCHING USER CONVERSATIONS FROM MONGODB - Načtení konverzací pro usera
---------------------------------------------------------------------------------
a) Načtení a renderování KONVERZACÍ pro daného Usera:
    a1) Ujístíme ID usera => useContext */
    const { user } = useContext(AuthContext);/*
    a2) Načteme data z API auložíme do state */
    useEffect(() => {
        const getConversations = async () => {
        try {
            const res = await axios.get(`${API}conversations/${user._id}`);
            setConversations(res.data);
        } catch (err) {
            console.log(err);
        }
        };
        getConversations();
    }, [user]); /*
    a3) Vyrenderujeme na základě mapování komponenty <Conversation > a do prop vložíme mapovaný obj (data kovnerzace) z databáze jako props. */
    <div className="chatMenuWrapper">
        ...
        {conversations.map((c) => (
        <Conversation conversation={c} />
        ))}
    </div> /*
    a4) Uvnitř conversation skrze useEffect HOOK uložíme konverzace do state a v levém sloupci je vyrenderujeme s názvem přítele a prof. obrázkem.*/
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
/*
Nahrávání změn na git:
git add složka
git commit -m "popis verze"
git push


U2) FE: FETCHING USER MESSAGES FROM MONGODB - Načtení ZPRÁV (uvnitř konverzací) pro usera
-----------------------------------------------------------------------------------------------------
a) Vytoříme si ve state 2 nové stavy:
    - currentChat = zvolené chatovací okno / stránka 
    - messages = zprávy uvnitř daného chatu a konverzace

b) Kondičně vyrenderujeme obsah chatovacího okna (Messenger.jsx):
    - Existuje ve state currentChat, neboli je zvoleno chatovací okno?
        => true: vyrenderuj obsah chatovacího okna
        => false: napiš hlášku "open a conversation to start a chat" 

JAK ZOBRAZÍME KONVERZACI PO KLIKNUTÍ NA KOMPONENTU <Conversation />? 
c) Zabalením komponenty do divu a nastavením onClick eventu na div. 
    c1) Mapujeme všechny elementy (c) pole konverzací z MongoDB do <Conversation/> komponenty, která je zabalená v divu s onClick eventem.
    c2) Tento onClick event vyvolá HOOK setCurrentChat, který nastaví hodnotu currentChat na zvolený namapovaný element (c). */
    <div className="chatMenuWrapper">
    {conversations.map((c) => (                 
    <div onClick={() => setCurrentChat(c)}>
        <Conversation key={c._id} conversation={c} currentUser={user} />
    </div>
    ))/*

JAK NAČTEME DATA ZE SERVERU DO STATE PŘI KLIKNUTÍ NA KONVERZACI?
d) Nastavíme si useEffect HOOK a dependancy nastavíme na currentChat - viz níže. */
// d1) useEffect se provede při načtení všech komponent
    useEffect(() => {   
        const getMessages = async () => {
        try {
            const res = await axios.get(`${API}messages/${currentChat?._id}`);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
        };
        getMessages();
// d2) Nastavíme DEPENDANCY - pokud dojde k změně currentChat - tak se tento HOOK ZNOVU PROVEDE.
    }, [currentChat]); 
/*
Kód výše v praxi znamená že po kliknutí na komponentu Conversation se vykoná onClick event setCurrentChat a změní se currentChat
    => na zákaladě této změny se znovu vykoná useEffect HOOK kde pomocí setMessages ukládáme zprávy do state.
HOTOVO: PO KLIKNUTÍ NA KONVERZACI SE VYRENDERUJE NOVÁ KONVERZACE A DO STATE SE ULOŽÍ ZPRÁVY / MESSAGES 

e) RENDEROVÁNÍ ZPRÁV / MESSAGES.
K renderování využijeme podobně mapování jako jsme to dělali s konverzací. 
e1) Zprávy předáváme přes PROPS do komponenty Message */
// Messenger.jsx
    <div className="chatBoxTop">
        {messages.map((m) => (
        <Message message={m} /> 
    ))} </div>/*
e2) Zprávy přijímáme v komponentě Message.jsx */
// Message.jsx 
export default function Message({ own, message }) { /*

f) Musíme identifikovat zprávy OWN vs zprávy PŘÍTELE.
    f1) Nastavíme kondiční renderování a v moment kdy userId === senderId => own: true */
    {messages.map((m) => (
        <Message message={m} own={m.sender === user.id}/>
      ))} /*

g) Zobrazení času odeslání zprávy
    g1) Pomocí knihovny timeago naformátujeme čas který je z databáze pomocí kódu níže uvnitř Message.jsx */
    <div className="messageBottom">{format(message.createdAt)}</div> /*


V) SENDING A NEW MESSAGE
----------------------------------------------------------------------
Jak nastavit odesílání zpráv do chatu?
a) Naprogramujeme textarea aby při změně dat (onChange) se uložilo do state.  */
    // Messenger.jsx
    <textarea
        className="chatMessageInput"
        placeholder="Write something..."
        onChange={(e) => setNewMessage(e.target.value)}
        value={newMessage}>
    </textarea>
    <button className="chatSubmitButton" onClick={handleSubmit}> Send </button> /*
b) Nastavíme aby při kliknutí na tlačítko "Odeslat" došlo k odeslání zprávy z textare (= newMessage uvnitř state) a handleSubmit  */
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const message = {
        sender: user._id,
        text: newMessage,
        conversationId = currentChat._id;
        };
        try {
        const res = await axios.post("/messages", message);
// c) Přidáme naši novou zprávu (newMessage) do pole zpráv, které jsme si načetli z REST API (= messages[] uvnitř state) - viz níže
        setMessages([...messages, res.data]);
        } catch (err) {
        console.log(err);
        }
    } /*
HOTOVO: Posíláme nové zprávy v chatu a ukládají se do databáze.


V2) SCROLLOVÁNÍ NA KONEC DIVU PO PŘIDÁNÍ NOVÉ ZPRÁVY
----------------------------------------------------------------------------------------
- Vytvoříme si referenci pomocí useRef a vložíme ji na Message element.
- Naprogramujeme si useEffect kód jelikož chceme vždy při změně message ve state nascrollovat na referenční message = nová message. */
const scrollRef = useRef();

<div ref={scrollRef}>
    <Message message={m} own={m.sender === user?._id} />
</div>

useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);/*

HOTOVO: V chatovacím okně dojde k automatickému scrollování na konec chatu po otevření, či odeslání nové zprávy.

PROBLÉM: Když odešleme zprávu jinému uživateli tak si musí refreshnout stránku k zobrazení zprávy.
ŘEŠENÍ: IMPLEMENTACE SOCKET.IO PRO INSTANTNÍ CHAT


W) INSTALACE SOCKET.IO
------------------------------------------------------
a) Konfigurace SOCKET.IO SERVERU
  - nová složka "socket"
  - vstoupit do složky "socket"
    - npm init -y
    - npm add nodemon socket.io
  - otevřeme socket/package.json
    - upravíme scripty => nadefinujeme start  */
        "scripts": {
            "start": "nodemon index.js"
        },/*
    - vytvoříme soubor "index.js" uvnitř socket
        - do souboru napíšeme: */
            const io = require("socket.io")(8900,{
                cors:{
                    origin:"http://localhost:3000",
                },
            });
            io.on("connection", (socket)=> {
                console.log("a user connected")
            }); /*
b) Napojení SOCKET.IO na stranu klienta
    - v příkazovém řádku uvnitř /client napíšeme příkaz:
         npm add socket.io-client

c) Start SOCKET.IO serveru
    - v příkazovém řádku uvnitř /socket napíšeme příkaz:
        npm start



X) IMPLEMENTACE SOCKET.IO
-----------------------------------------------------------------------------------------------------------
Po spuštění SOCKET.IO serveru vejdeme do Messenger.jsx abychom implementovali SOCKET.IO server
    a) Naimportujeme socket.io. */
        import {io} from "socket.io-client"; /*
    b) Vytvoříme const socket uvnitř state pomocí useState */
        const [socket, setSocket] = useState(null); /*
    c) Vytvoříme useEffect() aby došlo k nastavení socket ve state při re-renderování stránky proto useEffect()*/    
        useEffect(() => {
            setSocket(io("ws://localhost:8900"));
        }, []);/*

d) VYSVĚTLENÍ KÓDU SOCKET.IO
        V SOCKET SERVER:
                    use io = odešli něco klientovy
                    use io.emit = odešli něco každému klientovy
                    use io.to(socketID).emit = odešli něco jednomu klientovy
                    use socket.on = získáme něco od klienta
        V SOCKET CLIENT:
                    use socket.emit = odešli něco na server
                    use socket.on   = získej něco ze serveru

e) ZPRÁVA ZE SERVERU VŠEM KLIENTŮM:
    e1) Ze serveru v socket/index.js odešleme všem pomocí "io.emit" zprávu všem uživatelům. */
        // index.js
        io.emit("welcome","hello this is socket server!"); /* DŮLEŽITÉ: Tímto odešleme zprávu se serveru ale je třeba ji načíst v klientu!
    e2) V klientu uvnitř client/.../Messenger.jsx NAČTEME zprávu ze serveru pomocí "socket.on"
            - socket.on se vždy vykoná po re-renderování (v useEffect), pokud se změní state socket (dependency = socket) 
            - napíšeme do konzole zprávu kterou získáme ze serveru pomocí socket.on */
        // Messenger.jsx
        useEffect(()=>{
            socket.on("welcome", messages=>{
              console.log(messages);
            })
          },[socket]);/*
HOTOVO: DOKÁŽEME SKRZE SOCKET.IO NAČÍTAT ZPRÁVY ZE SERVERU A ZOBRAZOVAT JE V KLIENTU

f) ZOBRAZENÍ VŠECH ONLINE UŽIVATELŮ = odeslání zprávy ze serveru specifickým klientům  
K odeslání zprávy 1 userovy ze serveru potřebujeme znát socket id daného usera.
PROBLÉM: Socket id se pokaždé mění
 ŘEŠENÍ: Nejdříve odešleme pokaždé z klienta userId na server
    f1) Odešleme userId a socketId z KLIENTA (Messenger.jsx) na server
          - smažeme useState pro socket a nahradíme to useRef. */
        // Messenger.jsx
        const socket = useRef();
        useEffect(() => {
            socket.current = io("ws://localhost:8900");
        }, []);
        ... 
        useEffect(() => {
            socket.current.emit("addUser", user.id)
          }, [user]); /*
    f2) Načteme userId z klienta na SERVER (index.js) 
          - vytvoříme si prázdné pole userů, kde v poly objektů bude uloženo userId a socketId jako vlastnost (zpřístupnění = user.userId)
          - pomocí "socket.on" získáme userId ze serveru a získáme ho tak že vyhledáme "addUser" což jsme napsali do emit u klienta
          - následně napíšeme fci kdy přijímáme userId a vkládáme ho do fce addUser()
          - naprogramujeme fci addUser() abychom zkontrolovali zda userId je již zahrnut v poly userů. 
    f3) Uložíme userId do pole na serveru a toto pole všech userů s socketId a userId POŠLEME VŠEM KLIENTŮM díky příkazu io.emit("getUsers") */
            // index.js
                // iniciace pole objektů users
                let users = [];
                // fce na kontrolu a přidání usera do users[]
                const addUser = (userId, socketId) => {
                    // pomocí .some si namapujeme jednotlivé elementy (= user) pole users a kontrolujeme zda jejich vlastnost .userId neni shodna s arg userId
                    !users.some((user) => user.userId === userId) &&
                    users.push({userId, socketId});  //pokud shoda není (negace před výrazem výše) = true & může se vykonat přidání userId a socketId do users
                };
                // napojení na socket.io a odeslání dat klientům
                io.on("connection", (socket)=> {
                    console.log("a user connected");
                    io.emit("welcome","hello this is socket server!");
                        //získej userId a socketId od uživatele
                    socket.on("addUser", userId =>{
                        addUser(userId, socket.id);
                        //odešli pole userů s userId a socketId všem klientům
                        io.emit("getUsers", users);
                    });
                });/*
    f4) Načteme pole všech userů (.userId & .socketId) ze serveru v KLIENTU skrze příkaz "getUsers".
        - Pomocí "socket.on" získáme data ze server - budeme používat socket.on("getUsers") uvnitř useEffect hooku kde již máme "addUser"
        - Pomocí console.log(users) si můžeme zobrazit seznam všech userů které jsou v SOCKET.IO a uvidíme userId a socketId. */
            // Messenger.jsx
                const socket = useRef();
                useEffect(() => {
                    socket.current = io("ws://localhost:8900");
                }, []);
                useEffect(() => {
                    socket.current.emit("addUser", user._id);
                    socket.current.on("getUsers", (users) => {
                    console.log(users);
                    });
                }, [user]); /*
        - Výstup console.log() vypadá takto (pro 2 přihlášené uživatele): */
            0: {userId: '624350a8df288254db35b02d', socketId: 'UukyME9LodYjsFPjAAEz'}
            1: {userId: '6277b6d7a69e3424b2b63ff2', socketId: 'dzZqxF2K46i4eeMWAAEJ'}/*
HOTOVO: DOKÁŽEME ZÍSKAT SEZNAM PŘIHLÁŠENÝCH LIDÍ DÍKY KOMUNIKACE KLIENT => SERVER => KLIENT SKRZE SOCKET.IO
 PROBLÉM: Když user odejde z aplikace tak je stále zahrnut v seznamu userů, ačkoliv tam správně být nemá
 => ŘEŠENÍ: Naprogramování metody "disconnect" 1:34:00 
    f5) Naprogramujeme metodu socket.on("disconnect") na straně SERVERU pro odebrání usera z pole userů (= odhlášení ze Socket.IO)
        - Vytvoříme fci removeUser() ve které vyfiltrujeme pouze ty usery které nemají své socketId === socketId jež vstupuje jako arg */
        // index.js
            const removeUser = (socketId) =>{
                users = users.filter(user => user.socketId !== socketId);
            } /*
    f6) Zavoláme removeUser(socketId) uvnitř metody "disconnect" a jako argument vložíme socket.id. 
    f7) Po odebrání usera pošleme ZE SERVERU znovu KLIENTŮM seznam userů ("getUsers"), který bude aktualizovaný po odebrání. */
        // index.js
            socket.on("disconnect", ()=>{
                console.log("A user was diconnected from Socket.IO");
                removeUser(socket.id);
                io.emit("getUsers", users); // odeslání aktualizovaných userů
            })/*
HOTOVO: NYNÍ SE NÁM ODEBÍRÁ / PŘIDÁVÁ USER DO GLOBÁLNÍHO SEZNAMU PŘIHLÁŠENÝCH UŽIVATELŮ SKRZE SOCKET.IO
    - Díky tomu můžeme živě přistoupit k přihlášeným uživatelům a napsat jim.
    - Díky tomu uvidíme seznam online lidí.
            

Y) IMPLEMENTACE SOCKET.IO - ODESÍLÁNÍ PRIVÁTNÍCH ZPRÁV V CHATU.
------------------------------------------------------------------------------------------------
Jak probíhá odeslání privátní zprávy:

    1) Klient John odešle zprávu na server - KLIENT_socket.emit("sendMessage")
        Messenger.jsx => handleSubmit(): */
            socket.emit("sendMessage"):       
                { senderId: user._id,
                  receiverId: receiverId 
                  text: newMessage}/*

    2) Server načte zprávu od Johna - SERVER_socket.on("sendMessage")
        index.js:*/
            socket.on("sendMessage", ({senderId, receiverId, text})=>{ /* data které nám posílá klient
    
    3) Server odešle zprávu od John specifickému klientovy Jane - SERVER_io.to(socketID).emit
        index.js:*/
        socket.on("sendMessage", ({senderId, receiverId, text})=>{
            //najdeme na základě userId objekt usera Jane v poly userů na serveru, kterému chce klient John poslat zprávu (= Jane)
            const user = getUser(receiverId);
            // tomuto specifickému "user" (= Jane) odešleme text zprávy a id odesílatele (= John)
            io.to(user.socketId).emit("getMessage", {   // ZDE ODESÍLÁME ZPRÁVU JANE OD JOHNA
                senderId, 
                text,
            });
        });/*
    
    4) Klient Jane načte zprávu od Johna ze serveru - KLIENT_socket.on("getMessage")
        Messenger.jsx => useEffect((),[]): */
            useEffect(() => {
                socket.current = io("ws://localhost:8900");
                socket.current.on("getMessage", (data) => {
                setArrivalMessage({
                    sender: data.senderId,
                    text: data.text,
                    createdAt: Date.now(),
                });
                });
            }, []); /*

    5) Klient Jane & John - přidáme novou zprávu ze serveru do state Klienta do message (proto je vytvořen state arrivalMessage - viz nahoře) 
        - Při změně arrivalMessage nebo currentChat se vždy provede kód níže.
        Messenger.jsx => useEffect((),[arrivalMessage, currentChat]): */
        useEffect(() => {
            //Pomocí kódu níže kontrolujeme zda arrivalMessage není prázdný a zároven zabranujeme aby zprávy viděl někdo jiný mimo 2 členy chatu.
            arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
        }, [arrivalMessage, currentChat]);/*

a) SERVER PŘIJÍMÁ ZPRÁVU OD KLIENTA A:  socket.on("sendMessage"), kde budeme přijímat userId, receiverId a text zprávy.
    a1) Uvnitř "sendMessage" budeme volat metodu getUser abychom na základě userId našli objekt usera. */
        const getUser = (userId) =>{
            return users.find(users=>user.userId === userId)
        } /*
    a2) Naprogramuje "sendMessage" kód kde budeme volat getUser() */
        //index.js
        socket.on("sendMessage", ({senderId, receiverId, text})=>{
            //najdeme na základě userId objekt usera kterému posíláme zprávu
            const user = getUser(receiverId);
            // tomuto specifickému "user" odešleme text zprávy a id odesílatele (= autor zprávy)
            io.to(user.socketId).emit("getMessage", {
                senderId, 
                text,
            });
        });    /*

b) KLIENT A ODESÍLÁ NA SERVER:  po kliknutí na odeslání bude text zprávy odeslán na server odkud může být poslán recieveru
    b1) Po submitu zprávu pošleme na server následující:
        - senderId: user._id; (z kontextu)
        - recieverId: id z chat.members které se nerovná našemu id
        - text: newMessage
    b2) Získáme ID 2. člena konverzace neboli recievera. 
        - Pomocí kódu níže zjistíme id 2. člena chatu tím, že jeho id se nerovná našemu id */
            //Messenger.jsx
            const receiverId = currentChat.members.find(
                (member) => member !== user._id
            ); /*
    b3) Naprogramujeme "sendMessage" kód pro odeslání zprávu na server která obsahuje všechny nutná data. */
        //Messenger.jsx
        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId, //receiverId => receiverId: receiverId;
            text: newMessage
        });/*
HOTOVO: Odesíláme zprávu na SOCKET.IO server po kliknutí na SUBMIT. Zpráva obsahuje senderId, receiverId & text.

c) KLIENT B PŘIJÍMÁ ZPRÁVU ZE SERVERU: Získáme zprávu ze SOCKET.IO serveru POKAŽDÉ KDY DOJDE K RE-RENDEROVÁNÍ díky useEffect HOOKu (w/o dependancy).
    c1) Uložíme do state PŘÍCHOZÍ ZPRÁVU (arrivalMessage) */
        const [arrivalMessage, setArrivalMessage] = useState(null); /*
    c2) Upravíme podobu PŘÍCHOZÍ ZPRÁVY aby byla jako ostatní v MongoDB - uvnitř index.js "getMessage" máme k dispozici senderId & text. 
        V MongoDB musí mít message následující data:
            - sender
            - text
            - createdAt
        Upravíme tedy strukturu objektu který vkládáme do arrivalMessage pomocí setArrivalMessage.   */
            useEffect(() => {
            socket.current.on("getMessage", (data) => { //Ze serveru (index.js) máme u "getMessage" uložen obj data = {senderId, text}
                setArrivalMessage({
                sender: data.senderId,  //načteme ze serveru
                text: data.text,        //načteme ze serveru
                createdAt: Date.now(),  //doplníme aktuální čas
                });
            });    /*
    c3) Vložíme NOVOU PŘÍCHOZÍ zprávu do state současných zpráv - pomocí useEffect HOOKU tak uděláme při každé změně chatu a arrivalMessage*/
        useEffect(() => {
            //Pomocí kódu níže kontrolujeme zda arrivalMessage není prázdný a zároven zabranujeme aby zprávy viděl někdo jiný mimo 2 členy chatu.
            arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
        }, [arrivalMessage, currentChat]);/*


HOTOVO: V MESSENGERU POSÍLÁME INSTANTNÍ ZPRÁVY DÍKY SOCKET.IO 
        => UŽIVATELÉ JSOU V 1 KONVERZACI / RELACI A DÍKY SOCKET.IO SI INSTANTNĚ VYMĚNUJÍ ZPRÁVY.





Z) IMPLEMENTACE SOCKET.IO - ZOBRAZENÍ ONLINE UŽIVATELŮ
Vytvoříme si ve state onlineUsers.
Z komponenty Messenger budeme předávat následující data do komponenty <ChatOnline>: 
    - onlineUsers (ze state Messenger.jsx)
    - user._id (z kontextu z Messenger.jsx)
    - setCurrenChat (setState metoda z Messenger.jsx)

a) Data výše předáme do komponenty <ChatOnline /> */
    // Messenger.jsx
        <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
        </div> 
    // ChatOnline.jsx
        export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {          
    /*
b) ZÍSKÁNÍ SEZNAMU PŘÁTEL: Uvnitř komponenty ChatOnline.jsx vytvoříme state: friends, onlineFriends.
    - K získání dat do state "friends" využijeme metodu getFriends() z users.js API => tuto metodu budeme volat v rámci useEffect HOOKU. */
    //ChatOnline.jsx
    useEffect(() => {
        const getFriends = async () => {
          const res = await axios.get(`${API}users/friends/${currentId}`);
          setFriends(res.data);
        };
        getFriends();
      }, [currentId]);
    console.log(friends);/*
HOTOVO: Získáváme friends z API a ukládáme si seznam přátel do state => jsou zobrazeny v consoly výše.

c) ZOBRAZENÍ PŘÁTEL ONLINE - v useEffect HOOK vyfiltrujeme ze seznamu přátel pouze ty které jsou v onlineFriends.
    c1) Získání online pátel ze SOCKET.IO provádíme v Messenger.jsx - viz níže. */
    //Messenger.jsx
    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                //Níže filtrujeme pouze ty usery které přihlášený user sleduje a jejich userId === userId followingu přihlášeného usera
                user.followings.filter((f) => users.some((u) => u.userId === f))
              );
    }, [user]); /*
    c2) Seznam těchto online přátel vkládáme do komponenty <ChatOnline/> - viz kapitola výše.
    c3) Pomocí nového useEffect() HOOKu budeme filtrovat pouze ty usery ze seznamu přátel jež mají id zahrnuto v onlineUsers.*/ 
    //ChatOnline.jsx
    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
      }, [friends, onlineUsers]); /*
    c4) Pro každého přihlášeného usera budeme mapovat na <div> element přítele - viz níže. */
    // Chatonline.jsx
    return (
                <div className="chatOnline">
          {onlineFriends.map((o) => (   // ZDE MAPUJEME KAŽDÉHO Z onlineFriends na tento element
            <div className="chatOnlineFriend">
              <div className="chatOnlineImgContainer">
                <img
                  className="chatOnlineImg"
                  src={
                    o?.profilePicure
                      ? PF + o.profilePicure
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <div className="chatOnlineBadge"></div>
              </div>
              <span className="chatOnlineName">{o.username}</span>
            </div>
          ))}
                    </div>
      ); /*


d) ZOBRAZENÍ CHATU PO KLIKNUTÍ NA ONLINE USERA 
d1) Naprogramujeme BACKEND API kód pro získání konverzace ve které se vysktují 2x userId v conversation.js */
    //get conv includes two userId
    router.get("/find/:firstUserId/:secondUserId", async (req,res)=>{
    try{
        //Pomocí kódu níže najdeme konverzaci jejíž členy (všechny členy => $all) jsou tvořeny z firstUserId & secondUserId (na pořadí nezáleží)
        const conversation = await Conversation.findOne({
        members: {$all: [req.params.firstUserId, req.params.secondUserId]}
        });
        res.status(200).json(conversation);
    } catch(err){
        res.status(500).json(err);
    }
    });/*

d2) Naprogramujeme onClick metodu na základě které se při kliknutí na usera nastaví současný chat ve state => zobrazí se chat s daným userem.*/
return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
...            
const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `${API}conversations/find/${user._id}/${currentId}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };{/*

  HOTOVO: Po kliknutí na usera který je online se nám zobrazí konverzace s ním
  TODO: Každá zpráva bude mít profilový obrazek odesílatele 
        - BE API => getImg(userId)
        - FE => src={own? getImg(userId) : getImg(secondUserId)}
 






         


    
    
         
            
        


            

            


    
        
           

    

