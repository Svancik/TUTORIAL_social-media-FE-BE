/*
FACEBOOK MERN STACK (MongoDB, Express, React, Node)

1) Node.js Social Media REST API with MongoDb (https://www.youtube.com/watch?v=ldGl6L4Vktk&list=PLj-4DlPRT48lXaz5YLvbLC38m25W9Kmqy)
Tvoříme BACKEND v Node/Express/MongoDB.

 A) Vytvoříme nový projekt "node-rest-api"
    npm init (mačkáme enter)

 B) Přidáme knihovny s kterými budeme pracovat v našem REST API
    npm install express mongoose dotenv helmet morgan nodemon

        express:
            - SERVER
            - Jedná se o Node.js framework
            - Server poběží na expresu

        mongoose:
            - MODELACE DAT DO MONGODB
            - Pomáhá k tvorbě Mongo modelů, kterými můžeme vytvářet dokumentu uvnitř MongoDB
            - Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.
            - Snadněji jsme schopni namodelovat naše data pro uložení do MongoDB

        dotenv:
            - ZABEZPEČENÍ DAT
            - Používá se z bezpečnostních důvodu, protože z MongoDB databáze získáme URL kde je název databáze, heslo, uživatelské jméno a někdo to může ukrást a zneužít tyto data.
            - Citlivá data schováme v tomot safu v .env souborech.

        helmet: 
            - ZABEZPEČNÍ DAT V HLAVIČCE SERVER REQUESTU
            - Používá se z bezpečnostních důvodu, protože když odesíláme požadavek na server, tak uvnitř headeru požadavku jsou uložena zneužitelná data a vlastnosti.
            - Helmet předchází odeslání některých zneužitelných dat a některá data přidává pro vyšší zabezpečení.

        morgan:
            - MONITOROVÁNÍ REQUESTŮ NA SERVER
            - Kdykoliv uděláme request na server, ta získáme zpětnou vazbu jaký request se provedl, jaký byl výsledek a jak dlouho to trvalo - zobrazí se to v consoly.

        nodemon:
            - AUTOMATICKÉ REFRESHOVÁNÍ APLIKACE PŘI ZMĚNĚ
            - Když vytvoříme node aplikaci, tak musíme při každé změně v jakémkoliv souboru aplikace vstoupit do console a napsat pokaždé restart.

    Upravíme scripty v package.json díky nodemon aby automaticky došlo k refreshi:
      "scripts": {
            "start": "nodemon index.js"
        },

 C) Vytvoříme index.js

    C1) Vytvoříme EXPRESS */
const express = require("express");
const app = express();
app.listen(8800, () => {
  // volíme port :8800
  console.log("Backend server is running!"); // indikace že je vše ok
}); /*
    Pomocí npm start otestujeme.

    C2) Přidáme další knihovny a použijeme .env k zabezpeční URL databáze*/
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
dotenv.config();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  //kód použit na základě dokumentace - viz výše
  console.log("Connected to MongoDB");
});
/* vytvoříme .env soubor kam vložíme odkaz níže obsahující citlivé a bezpečnostní údaje.
    mongodb+srv://admin:<password>@mern.ba4yo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

    C3) Requesty na server - kontrola */
app.get("/", (req, res) => {
  res.send("Welcome to homepage"); //response po get requestu
}); /*
    Na localhost:8800 by se nám zobrazí zpráva "Welcome to homepage" ze serveru.

    Níže je ukázka toho co nám zaštituje knihovna morgan - monitorování requestů a repsonsů na server.
    [26/Mar/2022:22:01:23 +0000] "GET / HTTP/1.1" 200 19
    [26/Mar/2022:22:01:24 +0000] "GET /favicon.ico HTTP/1.1" 404 150

D) Vytvoření Routes REST API  (nová složka routes)
    D1) users.js */
const res = require("express/lib/response");
const router = require("express").Router();
router.get("/", (req, res) => {
  res.send("Hey it is user route");
});
module.exports = router;
// Uvnitř index.js nastavíme aby během přistoupení na adresu api/users došlo k vypsání obsahu uvnitř router.get() výše.
const userRoute = require("./routes/users");
app.use(
  "/api/users",
  userRoute
); /* při přístupu na adresu /api/users se vykoná userRoute (naimportováno)
    Veškeré operace s usery budeme provádět uvnitř users.js, jedná se o operace: update, delete, get 1 user, get all users atd.

    D2) auth.js
    Operace jako create user, login user budeme provádět uvnitř nové route auth.js
    Nyní máme tedy vytvořené 2 API routes:
        - http://localhost:8800/api/auth
        - http://localhost:8800/api/users

E) Tvorba modelu User.js
Vytvoříme novou složku models v rootu a uvnitř složky vytvoříme 2 soubory.
    Vytvoříme si schéma uživatele kde zadáme vlastnosti objektu pomocí knihovny mongoose a nastavíme zda jsou povinné, či min. délku. */
    const mongoose = require("mongoose");
    const UserSchema = new mongoose.Schema({
        username:{
            type:String,
            require: true,
            min:3,
            max:20,
            unique:true
        },
        ...
    });
    module.exports = mongoose.model("User", UserSchema);    /* tímto naše schéma exportujeme

F) ZPROVOZNĚNÍ FUNCKIONALITY REGISTER (Model: User.js)

F1) REGISTER: Test odeslání dat do Collections MongoDB
Výše jsme nastavili model jež vstoupí do databáze. Model naplníme databa a kostra jakou jsme navrhli bude udržena.
Upravíme auth.js pro Register POST - předáme zde Usera jehož schéma jsme navrhli v User.js a naplníme požadované data natvrdo.*/
    //auth.js
    const router = require("express").Router();
    const User = require("../models/User");
    //REGISTER
    router.get("/register", async (req,res)=>{      //jedná se o async operaci
        const user = await new User({               //proto musíme použít await
            username:"john",
            email:"john@gmail.com",
            password:"123456"
        })
        await user.save();  //toto by mělo být také await - ukládání do databáze.
        res.send("ok"); //kontrola že vše proběhlo ok 
    });
    module.exports = router;/*
TEST HOTOVO: Nyní se nám v databázi uložil záznam johna, protože jsme přistoupili na odkaz http://localhost:8800/api/auth/register
    - zároveň jsme získali message "ok" na tomto odkaze. 

Nyní smažeme kód uvnitř auth.js jež je výše - sloužil pouze pro test.
    
F2) REGISTER: Postman TEST
Nainstalujeme aplikaci POSTMAN a vytvoříme novou kolekci "social".
- uvnitř kolekce vytvoříme POST request na adresu http://localhost:8800/api/auth/register
- uvnitř body post requestu napíšme JSON objekt níže.
    {
        "username": "jane",
        "email": "jane@gmail.comm",
        "password": "123456789"
    }
- tento objekt posíláme na adresu /api/auth/register

Výše děláme POST REQUEST kdy posílám objekt usera "Jane" na server.
Uvnitř auth.js uděláme GET REQUEST a přistoupít k datům pomocí req.body.username req.body.email a req.body.password
- zároveň použijeme try/catch blok pro zachycení případých chyb. */
    // auth.js
    router.post("/register", async (req,res)=>{
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        try{
            const user = await newUser.save();
            res.status(200).json(user);
        } catch(err){
            console.log(err);
        }
    });/*
HOTOVO TEST: Díky POSTMAN jsme vložili nový objekt Jane do naší MongoDB databáze - data jsme zpřístupnili na webu MongoDB!!!

F3) REGISTER: Šifrování passwordu před uložením do databáze (HASH salt)
PROBLÉM: Uvnitř MongoDB webu můžeme stále vidět hesla v databázi.
ŘEŠENÍ: Nainstalujeme knihovnu bcrypt. => Díky této knihovně bude naše heslo zašifrováno do posloupnosti náhodných znaků.
    - npm add bcrypt
Nejdříve uvnitř auth.js naimportujeme tuto knihovnu bcrypt.*/ 
    const bcrypt = require("bcrypt");/*
Vytvoříme sůl, neboli několik náhodných bitů, které slouží jako doplňující vstup pro HASHovací šifru. */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt);/*
Kód vytváření newUser přesuneme celý do try/catch bloku, protože potřebujeme do OBJ new user vložit password: hashedPasword (namísto password: req.body.password)
Níže je ukázka celého kódu Register uvnitř auth.js*/
//REGISTER
router.post("/register", async (req,res)=>{
    try{
        //creating new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hashSync(req.body.password, salt);
        //creating new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        //save new user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        console.log(err);
    }
});/*

G) ZPROVOZNĚNÍ FUNKCIONALITY LOGIN (Model: User.js)
Nastavíme si REST API MongoDB aby při odeslání dat na server došlo k vyhledání emailu v databázi.
Struktura API bude následující:
    - Kontrola zda je email v databázi.
    - Kontrola zda je heslo v POST requestu po zašifrování stejné jako heslo zašifrované na serveru při registraci
    - Returnutí objektu user v RESPONSE se statusem 200.
Pomocí metody findOne() MongoDB vyhledáme zda to co získáme v response serveru na adrese /login je to co máme uloženo v databázi MongoDB.
Pomocí metody bcrypt.comper() porovnáme hesla v requestu a na serveru.
Nastavíme chybové hlášky.*/ 
    // auth.js - LOGIN
    router.post("/login", async (req, res)=> {      
    try{    
        //nalezení usera
        const user = await User.findOne({email: req.body.email});  //pomocí .findOne() hledáme shodu emailu v MongoDB s tím co je v POST requestu na API /login
        !user && res.status(404).json(`User ${req.body.email} was NOT FOUND in the database.`);     //pokud nenajdeme usera, nebo je status 404 vypíšeme hlášku
        //kontrola hesla
        const validPassword = await (req.body.password, user.password);
        !validPassword && res.status(400).json("Password is not correct.");        
        //returnutí objektu usera
        res.status(200).json(user);
    } catch (err){  
        res.status(500).json(err);
    }
    res.send(`User ${req.body.email} was succesfuly found in the database.`);   /*
HOTOVO: Kódem výše jsme nastavili API pro login které úspěšně funguje. V souboru auth.js JSME ZPROVOZNILI REST API PRO LOGIN A REGISTRACI.

H) API (ROUTE) PRO OPERACE S USERY (users.js) (Model: User.js)
V této kapitole naprogramujeme REST API pro následující operace s usery:
    - update user
    - delete user
    - get a user
    - follow a user
    - unfollow a user

    H1) UPDATE USER
    Pro update použijeme metodu .put("/:id") - param "/:id" označuje id v URL za lomítkem http://localhost:8800/api/users/159753 => id=159753
        - PUT http request vytváří nový zdroj informací, nebo mění současný zdroj informací na nový
    OPRÁVNĚNÍ K UPDATE:
        Zkontrolujeme zda id, jež je za lomítkem v URL je shodné s id usera requestu (jež je přihlášen pomocí LOGIN => z LOGIN jsme získali obj user).
            - req.body.userId === req.params.id
        Pokud má uživatel requestu adminský prává tak nemusíme kontrolovat id v URL s id v databázi
            - if(req.body.userId === req.params.id || req.user.isAdmin){...} 
    UPDATE HESLA:
        Pokud se v requestu mění heslo => req.body.password EXISTUJE, tak musíme opět zahashovat nové heslo jež je v body requestu
            - const salt = await bcrypt.genSalt(10);
            - req.body.password = await bcrypt.hash(req.body.password, salt);
    UPDATE OSTATNÍCH DAT:
        Pro update jiných dat než heslo musíme vyhledat Usera díky MongoDB metod findByIdAndUpdate:*/ 
            User.findByIdAndUpdate(req.params.id, {$set: req.body}); /*
        Tato metoda vyhledá id usera v databázi na základě id v URL (parametr id) a ZMĚNÍ OBJEKT V DB NA ZÁKLADĚ NOVÝCH DAT KTERÁ JSOU V BODY REQUESTU
            - Pokud bude v body requestu např. pouze "desc":"nový popis", tak se updatuje pouze tato vlastnost "desc" na "nový popis"    */
    // UPDATE user (auth.js) 
    router.put("/:id", async(req,res) => {
        if(req.body.userId === req.params.id || req.user.isAdmin){
            if(req.body.password){  //pokud existuje v body requstu vlastnost password tak musíme nové heslo před updatem zahashovat
                try{
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt); //změníme původní heslo v body na zašifrované heslo v body
                } catch(err){
                    return res.status(500).json(err);
                }
            }
            try{
                const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body}); //najdeme usera dle id v URL a updatneme dle body data
                res.status(200).json("Account has been updated.")
            } catch(err){
                return res.status(500).json(err);
            }
        } else{
        return res.status(403).json("You can update only your account.")
        }
    });/*
    test POSTMAN:
        - V POSTMANU vytvoříme požadavek na jakýkoliv obj v MongoDB databázi, vložíme id z databáze za API uvnitř URL
        - Budeme mít tedy např. adresu: http://localhost:8800/api/users/623f996549e85425419beab3
        - Na tuto adresu odešleme JSON objekt níže
            {
                "desc":"hey its my updated description",
                "username":"james",
                "email":"james@gmail.com"
            }
    HOTOVO: Update USER je hotový a funguje. Update buď změní aktuální vlastnost pokud je uvnitř těla požadavku, nebo přidá novou vlastnost 
    pokud v objektu databáze neexistuje.

    H2) DELETE USER
    Načteme opět user id z URL, pokud bude chybné id v URL tak napíšeme hlášku "You can delete only your account."
        - Budeme opět kontrolovat zda id v URL je shodné s id uvnitř body požadavku.
    Odstranění provedeme pomocí MongoDB metody findByIdAndDelete() - ARG této metode je id objektu v databázi, tedy id z API URL = req.params.id. */
    // DELETE user (auth.js)
    router.delete("/:id", async(req,res) => {
        if(req.body.userId === req.params.id || req.body.isAdmin){
            try{
                const user = await User.findByIdAndDelete(req.params.id);
                const {password,updatedAt, ...other}
                res.status(200).json("Account has been deleted succesfully.")
            } catch(err){
                return res.status(500).json(err);
            }
        } else{
        return res.status(403).json("You can delete only your account.")
        }
    });/*
    test POSTMAN
        - Vytvoříme DELETE request na URL http://localhost:8800/api/users/62402480a28c5b2b4da7ee87 
            {
            "userId":"62402480a28c5b2b4da7ee87"
            }
        - id žadatele a usera kterého cheme smazat jsou stejné => user může smazat účet pouze sám sobě

    H3) GET A USER
    Uděláme request na server pro usera jehož id bude v URL a vrátíme ho v response jako JSON objekt v případě úspěchu.
    Použijeme k tomu MongoDB metodu .findById(req.params.id) a nic nevkládme dovnitř těla JSON objektu.
    PROBLÉM: Server nám vrátí objekt s přebytečnými daty, které od usera nepotřebujeme (např. heslo a vlastnost updatedAt)
    ŘEŠENÍ: Použijeme SPREAD OPERATOR v OBJECT DESTRUCTURING, pomocí DESTRUCTURING vypíšeme vlastnosti které nechceme a v other je jen co chceme. */
    // GET a user (auth.js)
    router.get("/:id", async(req,res)=>{
        try{
            const user = await User.findById(req.params.id);
            const {password, updatedAt, ...other} = user._doc; //v ...other jsou všechny vlastnosti (user._doc) které jsme nevypsali (vše krom password a updatedAt)
            res.status(200).json(other);
        } catch(err){
            res.status(500).json(err);
        }
    });/*
    test POSTMAN: Uděláme GET požadavek na http://localhost:8800/api/users/623f996549e85425419beab3 a vrátí se nám obj bez password a updatedAt 

    H4) FOLLOW A USER
    Použijeme .put() protože prakticky budeme upravovat seznam sledovaných lidí (usera vyhledáme pomocí MongoDB metody .findById(req.body.userId)).
    Zkontrolujeme zda je id v URL (ten koho chceme sledovat) shodné s id v requestu (žadatel jež chce začít sledovat)
        - pokud je tak vypíšeme uživateli chybovou hlášku: "you cant follow yourself".
    Žadatel (id v userId) si chce přidat do seznamu svých followers jiného usera (userId uvnitř body).
        - každý uživatel má pole lidí které sleduje (followers) a zároveň pole lidí kteří uživatele sledují (followings) 
    Zkontrolujeme zda žadatel obsahuje již v poly followerů uživatele kterého chce začít sledovat
        - pokud ano, tak napíšeme hlášku: "you already follow this user".
    Žadateli updatneme vlasnost followers a přidáme tam id usera z URL A ZÁROVEŇ uživately kterého začal žadatel sledovat updatneme followings.
        - UPDATE provedeme pomocí MongoDB příkazu .updateOne() kde specifikujeme, že chceme provést push operaci => vkládání dat    
        - toho docílíme pomocí příkazu $push kdy chceme pushnout nová data do databáze {vlastnost: hodnota} => {$push:{followers: req.body.userId}} */
    // FOLLOW a user (auth.js)
    router.put("/:id/follow", async (req,res)=>{
        if(req.body.userId !== req.params.id){
            try{
                const user = await User.findById(req.params.id);    //ten koho chceme sledovat
                const currentUser = await User.findById(req.body.userId);  //žadatel
                if(!user.followers.includes(req.body.userId)){
                    await user.updateOne({$push:{followers: req.body.userId}}); //žadateli se změní senzam lidí které sleduje (followers)
                    await currentUser.updateOne({$push:{followings: req.params.id}});   //vložíme žadatele uživateli kterého jsme začli sledovat do followings seznamu
                    res.status(200).json("user has been followed");
                }
                else{
                    res.status(403).json("You already follow this user");
                }
            } catch(err){
                res.status(500).json(err);
            }
        } else{
            res.status(403).json("you cant follow yourself")
        }
    });/*
    test POSTMAN
    - Vytvoříme novýt PUT request (updatujeme vlastnost s polem koho user sleduje & seznam lidí kteří usera sledují)
    - PUT request bude vytvořen na usera jehož id bude v URL a za ním /follow - http://localhost:8800/api/users/623f996549e85425419beab3/follow
    - Uvnitř body requestu bude JSON objekt s vlasností userId (ten koho chceme sledovat)
        {
        "userId":"62401acfe97a65322b14fac4"
        }
    HOTOVO: Nyní máme funkcionality sledování usera a udržujeme živé 2 seznamy : lidí které sledujeme a lidí kteří nás sledují<div className=""></div>

    H5) UNFOLLOW user
    Použijeme .put() protože prakticky budeme upravovat seznam sledovaných lidí (usera vyhledáme pomocí MongoDB metody .findById(req.body.userId)).
    Struktura kódu zůstane téměř stejná jako follow s tím rozdílem, že při UPDATE nebudeme data pushovat (vkládat) ale pullovat (odebírat)
        - toho docílíme pomocí příkazu user.upDateOne({$pull:{vlastnost:hodnota}}) - pomocí $pull určujeme o jaký update se jedná.
    Zkontrolujeme zda se žadatel nachází v seznamu sledujících osoby u které rušíme follow.
        - pokud ano tak odebereme z 2 žadatele ze seznamu followings a sledovaného usera ze seznamu. */
    // UNFOLLOW a user (auth.js)
    router.put("/:id/unfollow", async (req,res)=>{
        if(req.body.userId !== req.params.id){
            try{
                const user = await User.findById(req.params.id);   
                const currentUser = await User.findById(req.body.userId);  
                if(user.followers.includes(req.body.userId)){
                    await user.updateOne({$pull:{followers: req.body.userId}}); 
                    await currentUser.updateOne({$pull:{followings: req.params.id}});   
                    res.status(200).json("user has been unfollowed");
                }
                else{
                    res.status(403).json("you dont follow this user");
                }
            } catch(err){
                res.status(500).json(err);
            }
        } else{
            res.status(403).json("you cant unfollow yourself")
        }
    });/*
    test POSTMAN:
        - Vytvoříme nový PUT request např. na URL http://localhost:8800/api/users/623f996549e85425419beab3/follow
        - Uvnitř body PUT requestu bude:
            {
                "userId":"62401acfe97a65322b14fac4"
            }
    HOTOVO: Jsme nyní schopni UNFOLLOWNOUT usera.

HOTOVO DOKONČILI JSME NAPROGRAMOVÁNÍ VŠECH OPERACÍ S MODELEM USERA (model usera v MongoDB databázi)


I) Tvorba modelu Post.js
Vytvoříme model / schéma Postu na sociální síti.
Již jsme udělali model pro Usera kterému jsme přiřadili vlastnosti, datové typy a omezení, které se následně přenesla do MongoDB databáze.
Model Postu bude obsahovat následující vlasnosti (sloupce):
    - userId (id autora postu - povinné)
    - desc (popis / text příspěvku)
    - img (obrázek který může být v příspěvku)
    - likes (pole liků)
Veškeré náležitosti a strukturu lze dohledat v node-rest-api/models/Post.js

J) API (ROUTE) PRO OPERACE S POSTY (posts.js) (Model: Post.js)
V této kapitole naprogramujeme REST API pro následující operace s posty/příspěvky:
    - create a post
    - update a post
    - delete a post
    - like a post
    - get a post
    - get timeline posts
Začneme vytvořením souboru a skončíme v momentě kdy budeme mít naprogramovanou funkcionalitu všech operací výše.
    a) Vytvoříme novou route na posts vytvořením souboru posts.js uvnitř /routes => /api/posts
    b) Naimporujeme novou route pod názvem postRoute uvnitř "index.js" (podobně jako máme userRoute, authRoute)
    c) Pomocí app.use() zaktivujeme route v momentě kdy bude v URL "/api/posts" - v ten moment se Route vykonná díky kódu níže.*/
        app.use("/api/posts", postRoute); /*

    J1) CREATE a post 
    Vytvoříme POST route na "/".
    Vytvoříme obj newPost, který bude instancí modelu Post z Post.js.    
        - tělem (obsahem) modelu Post bude tělo POST Request (JSON objekt = req.body) 
    Vytvoříme obj savedPost = await newPost.save() - pokud bude save úspěšný, tak se nám vrátí uložený obj do databáze (savedPost = newPost)
        - pokud to bude neúspěšné tak musíme chybu podchytit v try/catch bloku */
    //create a post (posts.js)
    router.post("/", async (req,res) =>{
        const newPost = new Post(req.body);
        try{
            const savedPost = await newPost.save();
            res.status(200).json(savedPost)
        } catch(err){
            res.status(500).json(err);
        }
    });/*
    test POSTMAN:
        - Vytvoříme POST request na http://localhost:8800/api/posts
        - Zkopírujeme userId jiného usera z databáze - nemůže to být prázdné, userId = required
        - Pokud úspěšně odešleme JSON objekt níže POST requestem na uvedenou adresu tak se nám zobrazí Post objekt z databáze.
        {
            "userId":"623f996549e85425419beab3",
            "desc":"Hey, this is post from John",
            "img":"image.png"
        }

    J2) UPDATE a post
    Pro update Postu potřebujeme:
        - načíst Post z DB na základě id v URL (params) => Post.findById()
        - porovnat zda userId v postu = userId v request body (ten kdo updatuje je autorem postu)
        - provést update v DB pomocí await post.updateOne({$set:req.body}); - updatujeme vším co je v body toho requestu.*/
    //update a user (posts.js)
    router.put("/:id", async (req,res) => {
        try{
            const post = Post.findById(req.params.id);  //načteme ID příspěvku z URL
            if(post.userId = req.body.userId){  //posoudíme id usera v příspěvku s id usera v body requestu
                await post.updateOne({$set:req.body});  //nastavíme JSON obj v databázi na data z JSON obj v body requestu
                res.status(200).json("the post has been updated");
            } else{
                res.status(403).json("you can update only your post");
            }
        } catch (err) {
            res.status(403).json(err);
        }
    });/*
    test POSTMAN:
        - PUT REQUEST na http://localhost:8800/api/posts/62401acfe97a65322b14fac4 (req.params === req.body.userId)
        - Body requestu:
            {
                "userId":"62401acfe97a65322b14fac4",
                "desc":"Hey i updated my post, John Dick"
            }

    PROBLÉM V PRROVNÁNÍ post.userId = req.body.userId BY MĚLO BÝT post.userId === req.body.userId ALE NEJEDNÁ SE O EKVIVALENT - proč???
            => VYŘEŠENO: ZAPOMNĚL JSEM NA KLÍČOVÉ SLOVO AWAIT PŘI OPEPRACI VYHLEDÁVÁNÍ V DATABÁZI. 
    HOTOVO: UPDATUJEME JSON objekt v databázi při verifikaci userId. Update spočívá v přepsání existujících a připsání nových vlastností.


    J3) DELETE a post
    Jedná se o kopii Update s drobnými změnami.*/
    //delete a user (posts.js)
    router.delete("/:id", async (req,res) => {
        try{
            const post = await Post.findById(req.params.id);
            if(post.userId === req.body.userId){
                await post.deleteOne(); //pokud najdeme post který splnuje kritérie (userId příspěvku === userId žadatele v body requestu)
                res.status(200).json(post);
            } else{
                res.status(403).json("you can delete only your post");
            }
        } catch (err) {
            res.status(403).json(err);
        }
    }); /*
    test POSTMAN:
        - Vytvoříme DELETE request na adresu http://localhost:8800/api/posts/62435e1427c1a856cd455697
        - V těle tohoto requestu bude JSON objekt ve kterém bude pouze userId usera, který je autorem příspěvku. 
            { "userId":"624350a8df288254db35b02d" }
    HOTOVO: Mažeme záznam postu v databázi na základě verifikace userId.
    
    J4) LIKE & DISLIKEa post
    Likenutí příspěvku bude spočívat v změně vlastnosti likes[] uvnitř DB => jedná se o update => provedeme PUT request.
    Načteme z URL id příspěvku, tudíž adresa API bude /:id/like
    Nejdříve zkontrolujeme, zda user který chce likenout příspěvek ho již likenul - usera zjistíme podle userId v body PUT requestu který likuje.
    Pokud likující user nexistuje v poly likes u příspěvku, tak změníme stav vlastnosti likes[] u příspěvku a vložíme zde userId z body requestu.
        - vlastnost změníme pomocí MongoDB metody .updateOne() kde pomocí příkazu $push, pushneme do vlastnosti likes userId z body PUT requestu.*/
    //like & dislike a post (posts.js)
    router.put("/:id/like", async (req,res)=>{
        try{
            const post = await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({$push: {likes: req.body.userId}});
                res.status(200).json("The post has been liked");
            } else{
                await post.updateOne({$pull: {likes:req.body.userId}});
                res.status(200).json("The post has been disliked");
            }
        } catch(err){
            res.status(500).json(err);
        } 
    });/*
    test POSTMAN:
        - URL bude http://localhost:8800/api/posts/624350bcdf288254db35b02f/like
        - tělo requestu bude { "userId":"624350a8df288254db35b02d" }
    HOTOVO: Likujeme a dislikujeme objekt post v závislosti na tom zda user již příspěvek likenul/dislikenul

    J5) GET a post
    Na základě id příspěvku v URL za api/posts identifikujeme post který chceme načíst ze serveru.
    Post s tímto id najdeme pomocí mongoose metody .findById(req.params.id) - to co nám metoda vrátí vložíme jako response a tím načteme (GET) */
    //get a post (posts.js)
    router.get("/:id", async (req,res) =>{
        try{
            const post = await Post.findById(req.params.id);
            res.status(200).json(post); //post vrátíme v response ze serverz
        } catch(err){
            res.status(500).json(err);
        }
    });/*
    test POSTMAN:
        - Uděláme GET request na http://localhost:8800/api/posts/624350bcdf288254db35b02f a v response získáme post s požadovaným id.
    HOTOVO: Získáváme post JSON objekt na základě id postu v URL.ad

    J6) GET TIMELINE posts (*** asynchronnous fetch ***)
    TIMELINE posts jsou posty lidí které followujeme společně s posty usera.
    Nejdříve přistoupíme k obj user, který vytvořil request/požadavek => najdeme takového user v DB vyhledáním podle id z body GET requestu.
    Uložíme všechny posty usera (žadatele).
    Načteme všechny posty uživatelů které user (žadatel) sleduje.
    Budeme dělat spoustu asynchronních operací na databázi hledáním postů => POUŽIJEME PROMISE (Promise.all())
        - DŮLEŽITÉ: PROMISE UMOŽŇUJE MAPOVÁNÍ Promise.all(userPosts.map => ...)
    Pomocí Promise budeme mapovat id uživatelů které use(žadatel) sleduje (friendId) a budeme pomocí tohoto id hledat shodu v userId příspěvků.
    Máme tedy userPosts & friendPosts - tato 2 pole spojíme a odešleme v response pomocí .concat()*/
    //get timeline posts (posts.js)
    router.get("/timeline/all", async (req,res)=>{  //URL musí být /timeline/all, jelikož pouze get /timeline by mohlo být chápáno jako get /:id
        try{
            const currentUser = await User.findById(req.body.userId);   //nalezení usera (žadatele) který vytvořil request
            const userPosts = await Post.find({userId: currentUser._id});   //uložení všech postů žadatele
            const friendPosts = await Promise.all(
                currentUser.follwings.map(friendId=>{    //mapování friendId do metody.find() 
                    return Post.find({userId: friendId})    //výsledek je uložen pomocí returnu v friendPosts
                })
            );
            res.json(userPosts.concat(...friendPosts)); //pomocí concat spojíme 2 pole příspěvků - žadatele a jeho followerů.
        } catch(err){
            res.status(500).json(err);
        }
    });/*
    test POSTMAN:
        - URL adresa je http://localhost:8800/api/posts/timeline/all
        - OBJ který posíláme je {"userId":"624377e73169ef0c85fc68cf"}
    HOTOVO: FETCHUJEME (získáváme) POSTY SVOJE A SVÝCH FOLLOWERŮ POMOCÍ PROMISE

KONEC: Dokázali jsme naprogramovat BACKEND se spoustou funkcionalit.
ZHODNOCENÍ: 
    -   Jedná se o rychlé naprogramování BACKENDU pro "sociální síť"
    -   Bylo by dobře přidat ERROR HANDLING & VERIFIKACI dat vstupujících do modelu.
BUDOUCNOST: Nyní naprogramujeme frontend a nebudeme již používat POSTMAN k odeslání requestů, ale bude je posílat stránka.

K) NAHRÁNÍ BACKENDU NA GIT 
Nahrajeme hotový BACKEND (node-rest-api) na GIT:
    - vytvoříme .gitignore kde napíšeme "node_modules/"
    - vytvoříme na githubu nový repozitář
Provedem klasické příkazy níže