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
});

export const Follow = (userId) => ({
    type:"FOLLOW",
    payload: userId
});    

export const Unfollow = (userId) => ({
    type:"UNFOLLOW",
    payload: userId
});