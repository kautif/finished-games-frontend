import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import "./GameData.css";

export default function GameData (props) {

    return (
        <Table striped bordered hover size="sm">
        <tr>
            <th></th>
            <th>Regular</th>
            <th>Mario</th>
            <th>Pokemon</th>
            <th>Minecraft</th>
            <th>Other</th>
        </tr>
        <tr>
            <td className="gamedata__row-status">PLAYING</td>
            <td>{props.gamesObj.regular.playing}</td>
            <td>{props.gamesObj.mario.playing}</td>
            <td>{props.gamesObj.pokemon.playing}</td>
            <td>{props.gamesObj.minecraft.playing}</td>
            <td>{props.gamesObj.other.playing}</td>
        </tr>
        <tr>
            <td className="gamedata__row-status">UPCOMING</td>
            <td>{props.gamesObj.regular.upcoming}</td>
            <td>{props.gamesObj.mario.upcoming}</td>
            <td>{props.gamesObj.pokemon.upcoming}</td>
            <td>{props.gamesObj.minecraft.upcoming}</td>
            <td>{props.gamesObj.other.upcoming}</td>
        </tr>
        <tr>
            <td className="gamedata__row-status">COMPLETED</td>
            <td>{props.gamesObj.regular.completed}</td>
            <td>{props.gamesObj.mario.completed}</td>
            <td>{props.gamesObj.pokemon.completed}</td>
            <td>{props.gamesObj.minecraft.completed}</td>
            <td>{props.gamesObj.other.completed}</td>
        </tr>
        <tr>
            <td className="gamedata__row-status">DROPPED</td>
            <td>{props.gamesObj.regular.dropped}</td>
            <td>{props.gamesObj.mario.dropped}</td>
            <td>{props.gamesObj.pokemon.dropped}</td>
            <td>{props.gamesObj.minecraft.dropped}</td>
            <td>{props.gamesObj.other.dropped}</td>
        </tr>
    </Table>
    )
}