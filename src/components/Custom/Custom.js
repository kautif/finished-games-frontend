import React from "react";

export default function Custom () {
    return (
        <div>
            <form>
                <input type="text" placeholder="title"/>
                <input type="text" placeholder="image url"/>
                <label>Date:</label><input className="search-game__date" type="date" name="date-added"/>
            <div className="search-game__rating">
                <label>Rating: </label>
                <select className="search-game__rating__num">
                    <option selected value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>    
                </select>    
            </div>
            <div className="search-game__status">
                <label>Game Status</label>
                <select>
                    <option selected="selected" value="playing">Playing</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>
            <textarea placeholder="Let your viewers know how you felt about this game" ></textarea>
            {/* {userGameNames.includes(game.name) ? <p className="search-result__added">Added</p> : <p className="search-result__add-btn" onClick={(e) => addGame(game.name, game.background_image, e.target.previousElementSibling.value, e.target.previousElementSibling.previousElementSibling.children[1].value, i)}>Add Game</p>} */}
            <p>Add Game</p>
            </form>
        </div>
    )
}