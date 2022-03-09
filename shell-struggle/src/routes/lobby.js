import React from "react";
import { firestore, db } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { set, push, ref } from "firebase/database";
import { sendRequest } from "../database";

async function createRoomandMoveThere(uid1, uid2) {
    //const newRoomRef = await push(ref(db));
    //set(newRoomRef, {
        //user1: uid1
    //});
    await sendRequest(uid1, uid2);
}

function FightButton(props) {
    return(
        <button onClick={() => createRoomandMoveThere(props.uid1, props.uid2)}>
            FIGHT
        </button>
    );
}

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userSearch: "",
            completeUserSearch: "",
            searchedUser: null, // uid
            searchedData: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    uid = this.props.uid;

    handleChange(event) {
        this.setState({userSearch: event.target.value});
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({completeUserSearch: this.state.userSearch});
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", this.state.userSearch, limit(1)));
        const users = await getDocs(q);
        if (users.empty) {
            this.setState({searchedUser: null});
        }
        users.forEach((doc) => {
            this.setState({
                searchedUser: doc.id,
                searchedData: doc.data()
            });
        });
    }

    render() { 
        let userDisplay = <div></div>;
        if (this.state.completeUserSearch !== "") {
            if (this.state.searchedUser) {
                let fight = <FightButton uid1={this.uid} uid2={this.state.searchedUser}/>;
                if (this.state.searchedUser === this.uid) {
                    fight = <div>You can't fight yourself, silly :)</div>
                }
                const user = this.state.searchedData;
                userDisplay =
                    <div>
                        <div>User: {user.username}</div>
                        <img src={user.icon} alt="" width="128" height="128" />
                        <div>Balance: {user.wallet} coins</div>
                        {fight}
                    </div>;
            } else {
                userDisplay = 
                    <div>
                        No user was found with the email: "{this.state.completeUserSearch}".
                    </div>;
            }
        }

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Enter an email to search for a user:
                        <input type="text" value={this.state.userSearch} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                    {userDisplay}
                </form>
            </div>
        );
    }
}

export default Lobby;