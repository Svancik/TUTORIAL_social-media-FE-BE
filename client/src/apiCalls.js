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
}