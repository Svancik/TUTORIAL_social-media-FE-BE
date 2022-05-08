const AuthReducer = (state, action) => {
    switch(action.type){
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
                error: action.payload, // pokud bude FAILURE tak uložíme do error response z request = action.payload
            };    
        case "FOLLOW":
            return {
                ...state, // = spreading the INITIAL STATE,
                user: {
                    ...state.user,
                    followings: [...state.user.followings, action.payload]
                }
            };  
        case "UNFOLLOW":
            return {
                ...state, 
                user: {
                    ...state.user,
                    followings: state.user.followings.filter(following => following !== action.payload)
                }
            }; 

        default:
            return state;
    }
};

export default AuthReducer;