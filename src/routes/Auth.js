import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const { target: { name, value },} = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        try{
            let data;
            //왜 이부분을 let으로 두었는가
            if(newAccount){
                //create Account 
                data = await authService.createUserWithEmailAndPassword(
                    email, password
                )
            } else{
                //log in 
                data = await authService.signInWithEmailAndPassword(
                    email, password
                )
            }
            console.log(data);
        } catch(error){
            setError(error.message)
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);
    //sign in 과 create account 를 바꿔주기 위해서 생긴 코드
    const onSocialClick = async (event) =>{
        const {target:{name},} = event;
        let provider;
        if (name === "google"){
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }else if (name === "github"){
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="email" onChange={onChange} name="email" placeholder="Email" required value={email} />
                <input type="password" onChange={onChange} name="password" placeholder="Password" required value={password} />
                <input type="submit" value={newAccount ? "Create Account" : "Sign in"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>)
};

export default Auth;