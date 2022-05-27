const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
// iniciace pole objektů users
let users = [];

// fce na přidání usera do users[] a kontrolu záznamu
const addUser = (userId, socketId) => {
    // pomocí .some si namapujeme jednotlivé elementy (= user) pole users a kontrolujeme zda jejich vlastnost .userId neni shodna s arg userId
    !users.some((user) => user.userId === userId) &&
      users.push({userId, socketId});  //pokud shoda není (negace před výrazem výše) = true & může se vykonat přidání userId a socketId do users
};

// fce na odebrání usera z users[]
const removeUser = (socketId) =>{
    users = users.filter(user => user.socketId !== socketId);
}


// napojení na socket.io a odeslání dat klientům
io.on("connection", (socket)=> {
    //připojení uživatele
    console.log("a user connected");
    io.emit("welcome","hello this is socket server!");
        //získej userId a socketId od uživatele
    socket.on("addUser", userId =>{
        addUser(userId, socket.id);
        //odešli pole userů s userId a socketId všem klientům
        io.emit("getUsers", users);
    });
    
    //odeslání zprávy


    //odpojení uživatele
    socket.on("disconnect", ()=>{
        console.log("A user was diconnected from Socket.IO");
        removeUser(socket.id);
    })
});