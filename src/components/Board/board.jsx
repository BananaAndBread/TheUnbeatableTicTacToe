import Box from '../BoardBox/board-box'
import React from "react";
import "./board.css"
import Modal from "../Modal/modal";
import axios from "axios"

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boxes: Array(9).fill(""),
            xIsNext: true,
            winner: null,
            draw: false
        }
    }
    reformatState() {
        let boxes_string = "";
        for (let box of this.state.boxes){
            if (!box){
                box = "-"
            }
            boxes_string = boxes_string + box
        }
        return boxes_string
    }

    async setMarkerBot() {
        const suggestion = await this.getSuggestions();
        let boxes = [...this.state.boxes];
        boxes[suggestion] = 'O';
        if (this.botWillLoseOrDraw(boxes)){
            console.log("Cheat")
        }
        this.setMarker(suggestion);

    }

    async setMarkerPlayer(index){
        await this.setMarker(index);
        this.setMarkerBot()
    }

    checkDraw(){
        for(const box of this.state.boxes){
            if (!box){
                this.setState({draw: false});
                return;
            }
        }
        this.setState({draw: true});
    }

    botWillLoseOrDraw(probableBoxes){
        console.log("probable Boxes" + probableBoxes);
        if (this.willWinNextMove("X", probableBoxes) || this.willBeDrawNextMove(probableBoxes)){
            return true
        }
        return false
    }

    willWinNextMove(marker, boxes){
        const winning_combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]];
        console.log(boxes);
        for (const winning_combination of winning_combinations){
            let numX = 0;
            let numEmpty = 0;
            for (const winning_place of winning_combination){
                if (boxes[winning_place]===marker){
                    numX++;

                } else if(!boxes[winning_place]){
                    numEmpty++;
                }
            }
            if (numX === 2 && numEmpty === 1) {
                return true
            }
        }
        return false;
    }
    willBeDrawNextMove(boxes){
        let numEmpty = 0;
        for (const box of boxes) {
            if (!box){
                numEmpty++;
                if(numEmpty>1){
                    return false;
                }
            }
        }
        return numEmpty === 1 && !this.willWinNextMove('X', boxes) && !this.willWinNextMove('O', boxes);

    }

    async setMarker(index){
        let boxes = [...this.state.boxes];
        let xIsNext = this.state.xIsNext;

        if (xIsNext){
            xIsNext = false;
            await this.setState({
                xIsNext: xIsNext
            });
            boxes[index] = "X"
        }
        else {
            xIsNext = true;
            boxes[index] = "O";
            await this.setState({
                xIsNext: xIsNext
            });
        }
        await this.setState({boxes});
        this.checkWinnings();
        this.checkDraw();
    }

    async getSuggestions(){
        const state = this.reformatState();
        const player = this.state.xIsNext ? "X" : "O";
        let URL = `https://stujo-tic-tac-toe-stujo-v1.p.rapidapi.com/${state}/${player}`
        let headers = {
            "x-rapidapi-host": "stujo-tic-tac-toe-stujo-v1.p.rapidapi.com",
            "x-rapidapi-key": "f7286c02d4mshc445cf18a069783p1c10efjsn21d58e055575",
            "useQueryString": true,
        };
        let config = {
            headers: headers
        };
        let response  = await axios.get(URL, config)
        return response.data['recommendation'];

    }

    restartGame() {
        let boxes =  Array(9).fill("");
        this.setState({boxes});
        this.setState({winner:null});
        this.setState({xIsNext:true});
        this.setState({draw:false});
    }

    checkWinnings(){
        const winning_combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                                    [0, 3, 6], [1, 4, 7], [2, 5, 8],
                                    [0, 4, 8], [2, 4, 6]];
        for (let mark of ["X", "O"]){
            for (const winning_combination of winning_combinations){
                let winning = true;
                for (let winning_place of winning_combination){
                    if (this.state.boxes[winning_place]!==mark){
                        winning = false;
                        break;
                    }
                }
                if (winning === true){
                    this.setState({ winner: mark });
                    return
                }
            }
        }
    }

    expandBoxes(){
        let JSXBoxes = this.state.boxes.map((value, index) => {
            return <Box disabled={this.state.boxes[index] || this.state.winner || !this.state.xIsNext} key={index} value={value} onClick={()=>{this.setMarkerPlayer(index)}}/>
        })
        let startIndex = 8;
        

        }

    render() {
        let boxes = [...this.state.boxes];
        for (let box in boxes){
            box.unshift()
            box.push()
        }
        return (
            <div>
                {(this.state.winner || this.state.draw) &&
                <Modal>
                    { this.state.winner &&
                        <div className="board__modal__winner-text"> {this.state.winner} won !!!</div>
                    }
                    {this.state.draw &&
                    <div className="board__modal__winner-text"> It's a draw!!!</div>
                    }
                    <button className="board__modal__button" onClick={() => {
                        this.restartGame()
                    }}>
                        Restart game
                    </button>
                </Modal>
                }
            <div className="board">
                <div className="board__grid">
                    {this.state.boxes.map((value, index) => {
                        return <Box disabled={this.state.boxes[index] || this.state.winner || !this.state.xIsNext} key={index} value={value} onClick={()=>{this.setMarkerPlayer(index)}}/>
                    })}
                </div>
            </div>
            </div>

        )
    }
}

export default Board
