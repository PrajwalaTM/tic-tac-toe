import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
      const color = this.props.isWinningSquare?'red':'white';
      return (
        <button className="square" onClick={this.props.onClick} style={{'background-color':color}}>
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    renderSquare(i,isWinningSquare) {
      return ( 
        <Square 
          value={this.props.squares[i]} 
          onClick = {() => this.props.onClick(i)}
          isWinningSquare = {isWinningSquare}
        />
      );
    }
    
    render() {
      const rows = [];
      const winsquares = this.props.winsquares;
      for(let i=0;i<3;i++){
        let cols = [];
        for(let j=0;j<3;j++){
            let isWinningSquare = false;
            if(winsquares && winsquares.includes(i*3+j))
              isWinningSquare = true;
            cols.push(this.renderSquare(i*3+j,isWinningSquare));
       }
       rows.push(<div className="board-row">{cols}</div>);
      }
      return (
        <div>
         {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          moveLocation: null,
        }],
        xIsNext: true,
        stepNumber:0,
      };
    }

    handleClick(i) {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const squares = current.squares.slice();

      if(squares[i] || calculateWinner(squares))
        return;
      squares[i]= this.state.xIsNext? 'X':'O';
      
      this.setState(
        {
          history: history.concat([{
            squares:squares,
            moveLocation: getLocation(i),
          }]),
          stepNumber:history.length,
          xIsNext:!this.state.xIsNext,
        });
    }

    jumpTo(step){
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2)===0,
      });
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step,move)=>{
        const desc = move? 'Go to move #'+move:'Go to game start';
        return (
          <li key={move}>
            <div>
              <button onClick = {()=>this.jumpTo(move)}>{desc}</button>
              {step.moveLocation && step.moveLocation[0] +','+ step.moveLocation[1]}
            </div>
          </li>
        )
      });

      let status;
      if(winner)
        status = 'Winner:' + winner.who;
      else
        status = 'Next player:'+ (this.state.xIsNext?'X':'O');
  
      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares = {current.squares}
              onClick = {(i)=> this.handleClick(i)}
              winsquares = {winner && winner.winsquares}   
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
  
  function calculateWinner(squares)
  {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for(let i=0;i<lines.length;i++){
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return (
          {
          who:squares[a],
          winsquares:lines[i],
        });
    }
    return null;
  }
  function getLocation(i){
    return [Math.floor(i/3),i%3];
  }