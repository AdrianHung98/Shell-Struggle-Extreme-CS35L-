import { signOut } from "@firebase/auth";
import React from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function SignOutButton() {
    let navigate = useNavigate()
    return(
        <button 
            class="btn btn-primary col-1"
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