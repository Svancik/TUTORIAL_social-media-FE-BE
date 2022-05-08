/* ---------------------------------  FRONT-END stránky -----------------------------------------------------

A) INICIALIZACE
V této sekci navážeme na náš soubor, kde jsme vytvořili backend pro aplikaci.
Vytvoříme složku react-social a napíšeme příkaz níže.
    "npx create-react-app ."

Smažeme nepotřebné soubory v projekt jež se nám vygenerovali pomocí npx create.
- v /src zůstanou jen soubory App.js a index.js
- v /public zůstane jen soubor index.html

A1) Fonty
Naimportujeme fonty z fonts.google.com a vložíme link níže do index.html
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,700;1,500&display=swap" rel="stylesheet">

A2) Styly
Vytvoříme styles v /public kde se nachází index.html

A3) Soubory
Naimportujeme složku assets z GIT projektu https://github.com/safak/youtube/tree/react-social-ui/public
    - zde se nachází fotografie uživatelů a ikon

A4) Homepage
Vytvoříme nový soubor "Home.js" v /pages/home.
Nainstalujeme extension "ES7+ React/Redux/React-Native snippets"
    - použijeme příkat "rfc" pro generování react komponenty 
    - smažeme klíčové slovo import - není třeba od Reactv17

A5) Material icons
Nainstalujeme React knihovnu material icons, diky ktere lze jednoduse v react aplikaci použit ikony.
    - npm install @material-ui/core
    - npm install @material-ui/icons
K jednotlivým ikonám z knihovny přistupujeme pomocí importování komponent z dané knihovny - viz ukázka níže. */
import { Person } from "@material-ui/icons";
function App() {
  return <Person />;
} /*

B) KOMPONENTA TOPBAR (vrchni lista)
Vytvoříme soubory "Topbar.js" & "topbar.css" uvnitř src/components/topbar.
Uvnitř topbar si vytvoříme stukturu topbarů: uvnitř wrapu bude topbar-left/right/center.
JELIKOŽ SE JEDNÁ O ČISTÝ HTML KÓD TAK HO NEBUDU KOMENTOVAT ZDE V TOMTO SOUBORU
    - sekci TOPBAR lze najít komentovanou na videu zde https://www.youtube.com/watch?v=zM93yZ_8SvE&t=530s
    - v zajímavých částech (css) je kód komentovaný
HOTOVO:
Dokončili jsme strukturu a stylizaci topbar lišty - kód je uvnitř components/toolbar.

C) STYLY
Ke stylizaci budeme používat CSS soubory, protože děláme React aplikaci a CSS styly jsou velmi jednoduché.
DŮLEŽITÉ: NEDOPORUČUJE SE POUŽÍVAT CSS K STYLIZACI REACTU
    => NEJLEPŠÍ JE POUŽÍT SASS (https://sass-lang.com/), nebo STYLED-COMPONENTS (https://styled-components.com/).

D) ROZVRŽENÍ TĚLA (BODY) STRÁNKY (levá lišta - obsah - pravá lišta)
Máme dokončený Topbar (hlavičku stránky) a nyní budeme programovat komponenty z kterých bude složené tělo stránky.
Tělo bude složené z Sidebaru, Feedu a Rightbaru. 
Vytvoříme 3 složky pro komponenty výše a v nich budou .jsx a .css soubory.
Tyto 3 komponenty budeme muset zabalit do jedné, jelikož React vyžaduje aby vždy returnoval jeden objekt.
    D1) Vytvoříme nový div kterým uvnitř Home.jsx obalíme tyto 3 komponenty do kontejneru, abychom je mohli zarovnávat jak potřebujeme.
Tímto nám vznikne container ke kterému přidáme <Topbar/> => vše musíme zabalit do jednoho obj pomocí fragmentů.
    D2) Zabalení pomocí Fragmentů <> se provádí nově pomocí symbolů <> a </> - viz níže. */
          <>    - fragment
            <Topbar />
            <div className="homeContainer">
              <Sidebar />
              <Feed />
              <Rightbar />
            </div>
            <Sidebar />
          </> - konec fragmentu /*

DŮLEŽITÉ: JAK NASTAVIT POMĚRNÉ ŠÍŘKY DIVŮ?
    - wrapper/container bude mít nastaveno display: flex; width: 100%; 
    - jednotlivé komponenty budou mít flex: 2,5,6 (= jednotky šířky)

    D3) NÁZORNÁ UKÁZKA NASTAVENÍ POMĚRNÉ ŠÍŘKY DIVŮ:*/
    <div className="homeContainer">
        <Sidebar />
        <Feed />
        <Rightbar />
    </div>

    .homeContainer{
        display: flex;
        width: 100%
    }
    .sidebar{
        flex: 3;
    }
    .feed{
        flex:5;
    }
    .rightbar{
        flex:4;
    }/*
ZDE JSME ROZDĚLILI CELEM 12 JEDNOTEK ŠÍŘKY POMĚRNĚ (3/12 & 5/12 & 4/12)

E) SIDEBAR KOMPONENTA (32:45)
Pomocí kódu níže jsme si upravili lištu dle svojí vlastní potřeby => custom lišta.*/
::-webkit-scrollbar{
    width: 5px;
}
::-webkit-scrollbar-track{
    background-color: #f1f1f1;
}
::-webkit-scrollbar-thumb{
    background-color: rgb(223, 221, 221);
}
/*

F) FEED KOMPONENTA
Box shadow styly si lze nastavit na online stránce https://html-css-js.com/css/generator/box-shadow/
Vygeneruje se nám kód níže. */
-webkit-box-shadow: 0px 1px 7px 0px rgba(0,0,0,0.37); 
box-shadow: 0px 1px 7px 0px rgba(0,0,0,0.37); /*
FEED komponenta se skládá z share komponenty, kde můžeme přidat příspěvek formou fotografie, označení jiného uživatele, či sdílení pocitů.
FEED komponenta se skládá taktéž z postů, jež se nachází uvnitř post složky.
DŮLEŽITÉ: Hodně se používá display flex k horizontálnímu vycentrování.
    
G) RIGHTBAR KOMPONENTA
V rightbar komponentě bude kdo má dnes narozeniny, reklama a seznam online přátel.
Seznam přátel obsahuje lidi kteří jsou online => BUDEME POTŘEBOVAT MÍT STATUS ZELENÉ KOLEČKO U TĚCH KTEŘÍ JSOU ONLINE.
K vytvoření statusu online potřebujeme použít venkovní position relative a následně pro kolečko samotné position absolute.
DŮLEŽITÉ: Když používáme ul a li seznamy, tak musíme použít padding a margin 0, jelikož defaultně je padding a margin nastaven.

H) DYNAMICKÉ DATA 
Doposud jsme tvořili layout s hloupýmy daty. 
Nyní budeme předávat data do komponent z jiných souborů a budeme tedy dynamicky měnit obsah komponent které jsou stejné.
    - To provedem skrze mapování. 
a) Vytvoříme soubor dummyData.js.*/
export const Posts = [
    {
      id: 1,
      desc: "Love For All, Hatred For None.",
      photo: "assets/post/1.jpeg",
      date: "5 mins ago",
      userId: 1,
      like: 32,
      comment: 9,
    }/*
b) Předáme objekt z dummyData.js do komponenty Posts skrze PROPS a nastavíme key.*/
    {Posts.map((p) => {
        <Post key={p.id} post={p} />;
    })}/*
c) Uvnitř Post.jsx upravíme obsah na základě post objektu z PROPS*/
    export default function Post({ post }) {...}/*
d) Předáme vlastnosti z obj post do HTML elementů jako obsah
DŮLEŽITÉ: VOLITELNÁ VLASTNOST OZNAČÍME POMOCÍ OTAZNÍKU - viz níže.*/
    <span className="postText">{post?.desc}</span> /*post.desc může být null a nebude to bráno jako chyba
e) Načteme z DUMMY DATA usera pomocí filterování podle id.*/
    const user = Users.filter((u) => u.id === 1);
    console.log(user[0].username);/*
        - tímto získáme pouze usera s id = 1
f) Uvnitř postu máme id useraa, tudíž napojíme id z Postu a usera k získání username skrze filtrování!*/
    <span className="postUsername">
        {Users.filter((u) => u.id === post.userId)[0].username}
    </span>/*
    - DÍKY KÓDU VÝŠE FILTRUJEME USERY PODLE ID KTERÉ JE V DANÉM POSTU A SPLNUJE FILTR
    - KDYŽ JE FILTR SPLNĚN TAK NÁM TO RETURNE POLE A MY ZPŘÍSTUPNÍME NULTÝ (první) ELEMENT A PŘEČTEME JEHO VLASTNOST .username 

PROBLÉM RIGHTBAR: 
    - Při scrollování nám seznam online lidí přetéká do vrchního topbaru.

PROBLÉM LEFTBAR:
    - Při scrollování vlevo máme whitespace při seznamu přátel 
        => chceme aby zaplnili celý prostor a tam bylo možné skrolovat (fixed position)
            ŘEŠENÍ: Nastavíme pro tobar z-index: 999;
    - Při scrollování vlevo nám zmizí možnosti menu (Feed, Chats, Videos, Groups, Bookmarks, Questions, Jobs, Events, Courses) 
        => chceme aby to bylo vždy přišpendlené a neodjíždělo při scrollování
            ŘEŠENÍ: použijeme position: sticky uvnitř sidebar.css a třídy sidebar a nastavíme top: 50px

JÁDREM DYNAMICKÝCH DAT JE PROVEDENÍ NÁSLEDUJÍCÍCH KROKŮ:
    a) vytvoření nové komponenty
    b) naimportování nové komponenty kde ji chceme používat
    c) inicializace nové komponenty a využití .map a .filter k procházení objektu dat a namapování do PROPS nové komponenty
    d) práce s daty uvnitř nové komponenty*/
    // => viz níže dynamicky generovaný seznam všech uživatelů až na prvního user (tj. přihlášený user)
    .<ul className="sidebarFriendList">
        {Users.filter((u) => u.id !== 1).map((u) => (
        <li>
            <CloseFriend key={u.id} user={u} />
        </li>
        ))}
    </ul>
    /*

I) PRÁCE SE STATE (LIKE & SRDÍČKO) - přidání a odebrání liku/srdíčka 
Se state budeme jednoduše pracovat skrze useState HOOK uvnitř Post.jsx.
a) Vytvoříme nové HOOKy pomocí kódu níže.*/
    const [like, setLike] = useState(post.like);
    const [isLiked, setIsLiked] = useState(false);/*

b) Použijeme onClick event pro tlačíka na like u Postů a na základě podmínky ze state jestli je post likenutý přidáme/odeberem like
    b1) Logiku schováme do handler funkce "likeHandler"

c) Uvnitř fce likeHandler() přidáme like kondičně pokud je status isLiked true/false a následně status změníme.
    => potřebujeme 2 state (like = počet liků, isLiked = stav zda je likenutý/dislikenutý)*/
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);
  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1); // je Post likenutý? ANO = odeber like z postu, NE = přidej like k postu
    // Kdybychom nechali pouze kód výše tak jen donekončená přidáváme like, protože nezměníme stav isLiked
    setIsLiked(!isLiked); //Zde změníme opečně stav Postu zda je likenutý (defaultně je false a touto negací poprvé řekneme že post je likenutý)
  };/*

J) PROFILE PAGE
Vytvoříme Profile Page - jedná se o zcela novou stránku, tudíž do App.js načteme namísto komponenty <Home/> komponentu <Profile/>
Zkopírujeme strukturu komponent pro <Home/> do <Profile/> a z té budeme vycházet.

a) Vycentrování profilového obrázku v kruhu v centeru cover image: */
    .profileUserImg{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        //vycentrování 
        position: absolute;
        left: 0;
        right: 0;
        top: 150px;
        margin: auto;
        border: 3px solid white;
    }/*

b) Odstranění zobrazených narozenín a online lidí => PROPS do <Rightbar />
    - Upravíme kód a do komponenty Rightbar vždy vložíme do PROPS vlastnost profile

c) VYCETROVÁNÍ SEZNAMU PŘÁTEL DO MŘÍZKY 2x3:*/{ /{}
// Použijeme display flex > wrap > space-between a ve wraperu nastavíme také display flex a flex-direction je column
    .rightbarFollowings{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    /{}
    .rightbarFollowing{
        display: flex;
        flex-direction: column;
    /{}
    <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          <div className="rightbarFollowing">
            <img src="assets/person/1.jpeg" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img src="assets/person/2.jpeg" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img src="assets/person/3.jpeg" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img src="assets/person/4.jpeg" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img src="assets/person/5.jpeg" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
          <div className="rightbarFollowing">
            <img src="assets/person/6.jpeg" className="rightbarFollowingImg" />
            <span className="rightbarFollowingName">John Carter</span>
          </div>
        </div>/*

K) LOGIN PAGE

    a) 2 STEJNĚ VELKÉ DIVY UPROSTŘED OBRAZOVKY: *//{}
        .loginWrapper{
            width: 70%;
            height: 70%;
            display: flex;
        }    
        .loginLeft, .loginRight{
            flex: 1;
        }/*
    
    b) PŘEVEDENÍ OBSAHU Z VERITKÁLU DO HORIZONTÁLU */
        .loginBox{
            height: 300px;
            padding: 20px;
            background-color: white;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
        }/*
    
    c) VYCENTROVÁNÍ 1 DIVU s ŠÍRKOU 50% = ALIGN SELF : center


L) REGISTER PAGE
    POKRAČUJEME ZALOŽENÍM REGISTER PAGE 
https://www.youtube.com/watch?v=zM93yZ_8SvE&t=6409s


