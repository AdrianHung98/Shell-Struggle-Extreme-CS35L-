// Turtle Implementation
import './turtle.css';

function Turtle(props) {
    const imgWidth = 300;
    const percentage = 100*(props.health / props.maxHealth);
    const percentageWidth = percentage.toString() + "%"
    const displayHealth = (percentage === 0)? "hidden": "visible";
    //don't display any health if no health

    return(
        <div>
            <style>
            </style>
            <div className="TurtleDisplay">            
            <img 
                src={props.image} 
                width={imgWidth}
                height="300px%"
                alt=""
                />
            <div>
                <div className="HealthDisplay"><div>HP:</div>
                        <div className="HealthBar">
                            <div className="PercentageBar" style={{"visibility": displayHealth,"width": percentageWidth}}></div>
                        </div>
                        <div style={{float: 'right'}}>{props.health}/{props.maxHealth}</div>
                        </div>
                
                <div style={{"display" : "flex"}}><div style={{"flex": 1}}>HP: {props.maxHealth}</div><div style={{"flex": 1}}>INT: {props.intelligence}</div><div style={{"flex": 1}}>STR: {props.strength}</div></div>
            </div>
            </div>
        </div>
    );
}

export default Turtle