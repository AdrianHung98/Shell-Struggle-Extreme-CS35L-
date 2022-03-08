import React from "react";
import { firestore } from "../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userSearch: "",
            completeUserSearch: "",
            searchedUser: null,
            searchedData: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({userSearch: event.target.value});
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({completeUserSearch: this.state.userSearch});
        console.log(this.state.completeUserSearch);
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
                const user = this.state.searchedData;
                userDisplay =
                    <div>
                        <div>User: {user.username}</div>
                        <img src={user.icon} alt="" width="128" height="128" />
                        <div>Balance: {user.wallet} coins</div>
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
                </form>
                {userDisplay}
            </div>
        );
    }
}

export default Lobby;