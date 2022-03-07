// Turtle Implementation
import './turtle.css';

function Turtle(props) {
    return(
        <div>
            <style>
            </style>
            <div className="turtle-display">            
            <img 
                src={props.image} 
                width="128"
                height="128"
                alt=""
                />
            <ul>
                <li>HP: {props.health}</li>
                <li>INT: {props.intelligence}</li>
                <li>STR: {props.strength}</li>
            </ul>
            </div>
        </div>
    );
}

export default Turtle