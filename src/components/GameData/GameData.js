import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import "./GameData.css";

export default function GameData (props) {
    const [toggleTable, setToggleTable] = useState(false);
    console.log("other playing: ", props.gamesObj.other.playing)

    return (
        <div className="game-data-container">
            {!toggleTable && <div id="game-data__simplfied-flex">
                <div className="game-data__simplfied-flex-item">
                    <p>Total Games: </p>
                    <p>{props.gamesObj.regular.playing + props.gamesObj.regular.upcoming + props.gamesObj.regular.completed + props.gamesObj.regular.dropped + 
                    props.gamesObj.romhacks.playing + props.gamesObj.romhacks.upcoming + props.gamesObj.romhacks.completed + props.gamesObj.romhacks.dropped + 
                    // props.gamesObj.pokemon.playing + props.gamesObj.pokemon.upcoming + props.gamesObj.pokemon.completed + props.gamesObj.pokemon.dropped + 
                    props.gamesObj.mods.playing + props.gamesObj.mods.upcoming + props.gamesObj.mods.completed + props.gamesObj.mods.dropped 
                    
                    + props.gamesObj.other.playing + props.gamesObj.other.upcoming + props.gamesObj.other.completed + props.gamesObj.other.dropped}</p>
                </div>
                <div className="game-data__simplfied-flex-item">
                    <p>Completed: </p>
                    <p>{props.gamesObj.regular.completed 
                    + props.gamesObj.romhacks.completed + 
                    // props.gamesObj.pokemon.completed + 
                    props.gamesObj.mods.completed 
                    + props.gamesObj.other.completed}</p>
                </div>
                <div className="game-data__simplfied-flex-item">
                    <p>Regular: </p>
                    <p>{props.gamesObj.regular.playing + props.gamesObj.regular.upcoming + props.gamesObj.regular.completed + props.gamesObj.regular.dropped}</p>
                </div>
                <div className="game-data__simplfied-flex-item">
                    <p>Dropped:</p>
                    <p>{props.gamesObj.regular.dropped + props.gamesObj.romhacks.dropped + 
                    // props.gamesObj.pokemon.dropped + 
                    props.gamesObj.mods.dropped + props.gamesObj.other.dropped}</p>
                </div>
                <div className="game-data__simplfied-flex-item">
                    <p>Custom:  </p>
                    <p>{props.gamesObj.romhacks.playing + props.gamesObj.romhacks.upcoming + props.gamesObj.romhacks.completed + props.gamesObj.romhacks.dropped + 
                    // props.gamesObj.pokemon.playing + props.gamesObj.pokemon.upcoming + props.gamesObj.pokemon.completed + props.gamesObj.pokemon.dropped + 
                    props.gamesObj.mods.playing + props.gamesObj.mods.upcoming + props.gamesObj.mods.completed + props.gamesObj.mods.dropped + 
                    props.gamesObj.other.playing + props.gamesObj.other.upcoming + props.gamesObj.other.completed + props.gamesObj.other.dropped}</p>
                </div>
                <div className="game-data__simplfied-flex-item">
                    <p>Upcoming:</p>
                    <p>{props.gamesObj.regular.upcoming + props.gamesObj.romhacks.upcoming + 
                    // props.gamesObj.pokemon.upcoming + 
                    props.gamesObj.mods.upcoming + 
                    props.gamesObj.other.upcoming}</p>
                </div>
            </div>}
            {!toggleTable && <p id="game-data__more-details" onClick={() => {
                setToggleTable(true);
            }}>More Details</p>}
            {toggleTable && <Table id="game-data__detailed" striped bordered hover size="sm">
                <tr>
                    <th></th>
                    <th>Regular</th>
                    <th>Romhacks</th>
                    <th>Mods</th>
                    <th>Other</th>
                </tr>
                <tr>
                    <td className="gamedata__row-status">PLAYING</td>
                    <td>{props.gamesObj.regular.playing}</td>
                    {/* romhacks */}
                    <td>{props.gamesObj.romhacks.playing}</td>
                    {/* <td>{props.gamesObj.pokemon.playing}</td> */}
                    {/* Mods */}
                    <td>{props.gamesObj.mods.playing}</td>
                    <td>{props.gamesObj.other.playing}</td>
                </tr>
                <tr>
                    <td className="gamedata__row-status">UPCOMING</td>
                    <td>{props.gamesObj.regular.upcoming}</td>
                    {/* romhacks */}
                    <td>{props.gamesObj.romhacks.upcoming}</td>
                    {/* <td>{props.gamesObj.pokemon.upcoming}</td> */}
                    {/* Mods */}
                    <td>{props.gamesObj.mods.upcoming}</td>
                    <td>{props.gamesObj.other.upcoming}</td>
                </tr>
                <tr>
                    <td className="gamedata__row-status">COMPLETED</td>
                    <td>{props.gamesObj.regular.completed}</td>
                    {/* romhacks */}
                    <td>{props.gamesObj.romhacks.completed}</td>
                    {/* <td>{props.gamesObj.pokemon.completed}</td> */}
                    {/* Mods */}
                    <td>{props.gamesObj.mods.completed}</td>
                    <td>{props.gamesObj.other.completed}</td>
                </tr>
                <tr>
                    <td className="gamedata__row-status">DROPPED</td>
                    <td>{props.gamesObj.regular.dropped}</td>
                    {/* romhacks */}
                    <td>{props.gamesObj.romhacks.dropped}</td>
                    {/* <td>{props.gamesObj.pokemon.dropped}</td> */}
                    {/* Mods */}
                    <td>{props.gamesObj.mods.dropped}</td>
                    <td>{props.gamesObj.other.dropped}</td>
                </tr>
            </Table>}
            {toggleTable && <p id="game-data__less-details" onClick={() => {
                setToggleTable(false);
            }}>Less Details</p>}
        </div>
    )
}