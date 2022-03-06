import { signOut } from "@firebase/auth";
import React from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function SignOutButton() {
    let navigate = useNavigate()
    return(
        <button 
            className="sign-out-button"
            onClick={() => {
                try { signOut(auth) }
                catch {console.log("ERROR in SignOutButton()");};
                console.log("User signed out");
                navigate(`/`);
            }}>
            Sign Out
        </button>
    );
}

export default SignOutButton;