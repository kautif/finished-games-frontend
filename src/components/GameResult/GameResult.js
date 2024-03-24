import React from "react";

export default function GameResult (props) {
    return (
        <div>
            <h2>{props.title}</h2>
            <img src={props.image} alt={props.title + " image"} />
            <button>Add Game</button>
        </div>
    )
}