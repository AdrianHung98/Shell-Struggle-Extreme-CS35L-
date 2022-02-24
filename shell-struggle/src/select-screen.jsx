import React from 'react';
import './turtle.css'
import Turtle from './turtle.jsx';
import './select-screen.css'

const turtle = <Turtle 
  class='scientist' 
  attack_stat='5'
  wisdom_stat='10'
  speed_stat='5'
  image='https://cdn.drawception.com/images/panels/2017/5-8/SSFCdOc9BN-2.png'
/>

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
            current_page: "main"
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
                    This is a holding page for the game. Here's a fun turtle:
                    <div>{turtle}</div>
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