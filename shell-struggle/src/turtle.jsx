// Turtle Implementation

function Turtle(props) {
    return(
        <div className="TurtleDisplay">
            <div>I am a turtle</div>
            <div>My class is {props.class}</div>
            <div>My attack stat is {props.attack_stat}</div>
            <div>My wisdom stat is {props.wisdom_stat}</div>
            <div>My speed stat is {props.speed_stat}</div>
            <div>Here's a picture of me!</div>
            <img 
                src={props.image} 
                width="128"
                height="128"
                alt=""
                />
        </div>
    );
}

export default Turtle