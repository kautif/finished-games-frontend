import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import "./GameData.css";

export default function GameData (props) {

    return (
        <div className="game-data__simplfied-flex">
            <div className="game-data__simplfied-flex-item">
                <p>Total Games: </p>
                <p>{props.gamesObj.regular.playing + props.gamesObj.regular.upcoming + props.gamesObj.regular.completed + props.gamesObj.regular.dropped + props.gamesObj.mario.playing + props.gamesObj.mario.upcoming + props.gamesObj.mario.completed + props.gamesObj.mario.dropped + props.gamesObj.pokemon.playing + props.gamesObj.pokemon.upcoming + props.gamesObj.pokemon.completed + props.gamesObj.pokemon.dropped + props.gamesObj.minecraft.playing + props.gamesObj.minecraft.upcoming + props.gamesObj.minecraft.completed + props.gamesObj.minecraft.dropped + props.gamesObj.other.playing + props.gamesObj.other.upcoming + props.gamesObj.other.completed + props.gamesObj.other.dropped}</p>
            </div>
            <div className="game-data__simplfied-flex-item">
                <p>Regular: </p>
                <p>{props.gamesObj.regular.playing + props.gamesObj.regular.upcoming + props.gamesObj.regular.completed + props.gamesObj.regular.dropped}</p>
            </div>
            <div className="game-data__simplfied-flex-item">
                <p>Custom:  </p>
                <p>{props.gamesObj.mario.playing + props.gamesObj.mario.upcoming + props.gamesObj.mario.completed + props.gamesObj.mario.dropped + props.gamesObj.pokemon.playing + props.gamesObj.pokemon.upcoming + props.gamesObj.pokemon.completed + props.gamesObj.pokemon.dropped + props.gamesObj.minecraft.playing + props.gamesObj.minecraft.upcoming + props.gamesObj.minecraft.completed + props.gamesObj.minecraft.dropped + props.gamesObj.other.playing + props.gamesObj.other.upcoming + props.gamesObj.other.completed + props.gamesObj.other.dropped}</p>
            </div>
            <div className="game-data__simplfied-flex-item">
                <p>Completed: </p>
                <p>{props.gamesObj.regular.completed + props.gamesObj.mario.completed + props.gamesObj.pokemon.completed + props.gamesObj.minecraft.completed + props.gamesObj.other.completed}</p>
            </div>
            <div className="game-data__simplfied-flex-item">
                <p>Dropped:</p>
                <p>{props.gamesObj.regular.dropped + props.gamesObj.mario.dropped + props.gamesObj.pokemon.dropped + props.gamesObj.minecraft.dropped + props.gamesObj.other.dropped}</p>
            </div>
            <div className="game-data__simplfied-flex-item">
                <p>Upcoming:</p>
                <p>{props.gamesObj.regular.upcoming + props.gamesObj.mario.upcoming + props.gamesObj.pokemon.upcoming + props.gamesObj.minecraft.upcoming + props.gamesObj.other.upcoming}</p>
            </div>
        </div>
    //     <Table striped bordered hover size="sm">
    //     <tr>
    //         <th></th>
    //         <th>Regular</th>
    //         <th>Mario</th>
    //         <th>Pokemon</th>
    //         <th>Minecraft</th>
    //         <th>Other</th>
    //     </tr>
    //     <tr>
    //         <td className="gamedata__row-status">PLAYING</td>
    //         <td>{props.gamesObj.regular.playing}</td>
    //         <td>{props.gamesObj.mario.playing}</td>
    //         <td>{props.gamesObj.pokemon.playing}</td>
    //         <td>{props.gamesObj.minecraft.playing}</td>
    //         <td>{props.gamesObj.other.playing}</td>
    //     </tr>
    //     <tr>
    //         <td className="gamedata__row-status">UPCOMING</td>
    //         <td>{props.gamesObj.regular.upcoming}</td>
    //         <td>{props.gamesObj.mario.upcoming}</td>
    //         <td>{props.gamesObj.pokemon.upcoming}</td>
    //         <td>{props.gamesObj.minecraft.upcoming}</td>
    //         <td>{props.gamesObj.other.upcoming}</td>
    //     </tr>
    //     <tr>
    //         <td className="gamedata__row-status">COMPLETED</td>
    //         <td>{props.gamesObj.regular.completed}</td>
    //         <td>{props.gamesObj.mario.completed}</td>
    //         <td>{props.gamesObj.pokemon.completed}</td>
    //         <td>{props.gamesObj.minecraft.completed}</td>
    //         <td>{props.gamesObj.other.completed}</td>
    //     </tr>
    //     <tr>
    //         <td className="gamedata__row-status">DROPPED</td>
    //         <td>{props.gamesObj.regular.dropped}</td>
    //         <td>{props.gamesObj.mario.dropped}</td>
    //         <td>{props.gamesObj.pokemon.dropped}</td>
    //         <td>{props.gamesObj.minecraft.dropped}</td>
    //         <td>{props.gamesObj.other.dropped}</td>
    //     </tr>
    // </Table>
    )
}