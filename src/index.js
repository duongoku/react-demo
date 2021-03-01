import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className='square' onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (<Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />);
    }

    render() {
        let ret = [];
        for(let i=0; i<3; i++) {
            let tmp = [];
            for(let j=0; j<3; j++) {
                tmp.push(this.renderSquare(i*3+j));
            }
            ret.push(<div className="board-row">{tmp}</div>);
        }
        return (<div>{ret}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                posX: null,
                posY: null,
            }],
            isX: true,
            step: 0,
        };
    }

    checkEndGame(temp_squares) {
        const lines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for(let i=0;i<lines.length;i++) {
            if(temp_squares[lines[i][0]] != null
            && temp_squares[lines[i][0]] === temp_squares[lines[i][1]] 
            && temp_squares[lines[i][0]] === temp_squares[lines[i][2]]) {
                return temp_squares[lines[i][0]];
            }
        }
        return null;
    }

    handleClick(i) {
        const temp_history = this.state.history.slice(0, this.state.step+1);
        const temp_squares = temp_history[temp_history.length-1].squares.slice();
        if(this.checkEndGame(temp_squares)) {
            return;
        }
        if(!temp_squares[i]) {
            temp_squares[i] = this.state.isX ? 'X' : 'O';
            this.setState({
                history: (temp_history.concat([{
                    squares: temp_squares,
                    posX: parseInt(i%3),
                    posY: parseInt(i/3),
                }])),
                isX: !this.state.isX,
                step: temp_history.length,
            });
        }
    }

    jumpTo(move) {
        this.setState({
            step: move,
            isX: ((move % 2) === 0),
        });
    }

    render() {
        const temp_history = this.state.history;
        const temp_squares = temp_history[this.state.step].squares.slice();
        const winner = this.checkEndGame(temp_squares);

        const moves = temp_history.map((squares, move) => {
            let desc = move ? ('Go to move #' + move) : ('Go to game start');
            const pos = '('
                + (((move % 2) === 0) ? 'O' : 'X')
                + ', ' + squares.posY
                + ', '+ squares.posX
            + ')';
            if(move === this.state.step) {
                desc = (<b>{desc}</b>);
            }
            return (<li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
                {(move === 0) ? '(X/O, x, y)' : pos}
            </li>);
        });
        
        let status;

        if(winner) {
            // status = 'Winner is ' + winner;
            status = 'DarthReaver loses';
        } else {
            status = 'Next play is ' + (this.state.isX ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        isX={this.state.isX}
                        squares={temp_squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
