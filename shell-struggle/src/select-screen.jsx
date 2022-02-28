// select-screen.jsx

import React from 'react';
import './select-screen.css'
import GameCycle from './gameCycle';

function RedirectButton(props) {
    return(
        <button
            className='redirect_button'
            onClick={props.onClick}
        >
            Go to {props.pageName}
        </button>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current_page: "main",
            isLoggedIn: false
        }
    };


    renderRedirectButton(pageName) {
        return(
            <RedirectButton
                onClick={() => this.handleClick(pageName)}
                pageName={pageName}
            />
        );
    }

    handleClick(pageName) {
        this.setState({
            current_page: pageName
        });
    }

    render() {
        const pageName = this.state.current_page;

        if (pageName === "main") {
            return(
                <div>
                    This is a holding page for the main page.
                    <div>{this.renderRedirectButton("beastiary")}</div>
                    <div>{this.renderRedirectButton("game")}</div>
                    <div>{this.renderRedirectButton("shop")}</div>
                </div>
            );
        }

        if (pageName === "beastiary") {
            return(
                <div>
                    This is a holding page for the Beastiary.
                    <div>{this.renderRedirectButton("main")}</div>
                </div>
            );
        }

        if (pageName === "game") {
            return(
                <div>
                    <GameCycle/>
                    <div>{this.renderRedirectButton("main")}</div>
                </div> 
            );
        }

        if (pageName === "shop")
            return(
                <div>
                    This is a holding page for the shop.
                    <div>{this.renderRedirectButton("main")}</div>
                </div>
            );
    }
}

export default App