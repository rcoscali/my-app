import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
              value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
              />
        );
    }
    
    render() {
        return (
            <div>
              <div className="board-row">
                {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
              </div>
              <div className="board-row">
                {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
              </div>
              <div className="board-row">
                {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
              </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stepNumber: 0,
            history: [{
                squares: Array(9).fill(null),
                i: -1,
            }],
            xNextToPlay: true,
        };
    }
    
    computeWinner(squares)
    {
        var i, j;
        for (i = 0; i < 3; i++)
        {
            for (j = 0; j < 3; j++)
            {
                if (squares[j*3+i] === 'X' &&
                    j+1 < 3 &&
                    squares[(j+1)*3+i] === 'X' &&
                    squares[(j+1)*3+i] === 'X' &&
                    j+2 < 3 &&
                    squares[(j+2)*3+i] === 'X'
                   )
                    return 'X';
                if (squares[j*3+i] === 'X' &&
                    j+1 < 3 && i+1 < 3 &&
                    squares[(j+1)*3+(i+1)] === 'X' &&
                    j+2 < 3 && i+2 < 3 &&
                    squares[(j+2)*3+(i+2)] === 'X'
                   )
                    return 'X';
                if (squares[j*3+i] === 'X' &&
                    i+1 < 3 &&
                    squares[j*3+(i+1)] === 'X' &&
                    i+2 < 3 &&
                    squares[j*3+(i+2)] === 'X'
                   )
                    return 'X';
                if (squares[j*3+i] === 'X' &&
                    j+1 < 3 && i-1 >= 0 && 
                    squares[(j+1)*3+(i-1)] === 'X' &&
                    j+2 < 3 && i-2 >= 0 &&
                    squares[(j+2)*3+(i-2)] === 'X'
                   )
                    return 'X';
            }
        }
        for (i = 0; i < 3; i++)
        {
            for (j = 0; j < 3; j++)
            {
                if (squares[j*3+i] === 'O' &&
                    j+1 < 3 &&
                    squares[(j+1)*3+i] === 'O' &&
                    squares[(j+1)*3+i] === 'O' &&
                    j+2 < 3 &&
                    squares[(j+2)*3+i] === 'O'
                   )
                    return 'O';
                if (squares[j*3+i] === 'O' &&
                    j+1 < 3 && i+1 < 3 &&
                    squares[(j+1)*3+(i+1)] === 'O' &&
                    j+2 < 3 && i+2 < 3 &&
                    squares[(j+2)*3+(i+2)] === 'O'
                   )
                    return 'O';
                if (squares[j*3+i] === 'O' &&
                    i+1 < 3 &&
                    squares[j*3+(i+1)] === 'O' &&
                    i+2 < 3 &&
                    squares[j*3+(i+2)] === 'O'
                   )
                    return 'O';
                if (squares[j*3+i] === 'O' &&
                    j+1 < 3 && i-1 >= 0 &&
                    squares[(j+1)*3+(i-1)] === 'O' &&
                    j+2 < 3 && i-2 >= 0 && 
                    squares[(j+2)*3+(i-2)] === 'O'
                   )
                    return 'O';
            }
        }
        return 0;
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = this.computeWinner(squares);
        if (winner !== 0 || squares[i])
            return
        squares[i] = this.state.xNextToPlay ? 'X' : 'O';
        this.setState(
            {
                history: history.concat([{
                    squares: squares,
                    i: i,
                }]),
                xNextToPlay: !this.state.xNextToPlay,
                stepNumber: history.length,
            }
        );
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xNextToPlay: (move % 2) === 0,
        });
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        let status;
        const winner = this.computeWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                      'Go to move #' + move :
                      'Go to game start';
            return (
                <li key={move}>
                  <p className={(this.state.stepNumber === move ? 'selected-step' : '')}>[{(move > 0 ? Math.trunc(this.state.history[move].i /3) : '-')}, {(move > 0 ? this.state.history[move].i %3 :  '-')}] = '{(move > 0 ? ((move %2) ? 'X' : 'O') : '-')}' <button onClick={() => this.jumpTo(move)}>{desc}</button></p>
                </li>
            );
        });
        
        if (winner !== 0)
        {
            status = 'Winner: ' + winner;
        }
        else
        {
            status = 'Next player: ' + (this.state.xNextToPlay ? 'X' : 'O');
        }
        return (
            <div className="game">
              <div className="game-board">
                <Board
                  squares={current.squares}
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
