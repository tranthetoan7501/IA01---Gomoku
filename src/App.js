import './App.css';
import React from 'react';

function Square(props) {
  const className = 'square' + (props.isInWinline ? ' win' : '');
  if(props.isActive){
    return (
      <button
        className={className}
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  return (
    <button
      className={className}
      disabled = 'true'
      onClick={props.onClick}>
      {props.value}
      
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winLine = this.props.winLine;
    
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isActive ={winLine? false:true}
        isInWinline={winLine && winLine.includes(i)}
      />
    );
  }

  render() {
    const size = this.props.size;//this.size;
    let squares = [];
    for (let i = 0; i < size; ++i) {
      let row = [];
      for (let j = 0; j < size; ++j) {
        row.push(this.renderSquare(i * size + j));
      }
      squares.push(<div key={i} className="board-row">{row}</div>);
    }

    return (
      <div>{squares}</div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(100).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
      size:5
    };
  }
  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          latestMoveSquare: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleSortToggle() {
    this.setState({
      isAscending: !this.state.isAscending
    });
  }

  

  render() {

    const sizeChangeHandler = (event)=>{

      if(event.target.value>=5){
        this.setState({
          history: [
            {
              squares: Array(event.target.value*event.target.value).fill(null)
            }
          ],
          stepNumber: 0,
          xIsNext: true,
          isAscending: true,
          size:event.target.value
        });
      }
      
      
    }
    
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares,current.latestMoveSquare,this.state.size);
    const winner = winInfo.winner;

    let moves = history.map((step, move) => {
      const latestMoveSquare = step.latestMoveSquare;
      const col = 1 + latestMoveSquare % this.state.size;
      const row = 1 + Math.floor(latestMoveSquare / this.state.size);
      const desc = move ?
        `Go to move #${move} (${col}, ${row})` :
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={move === stepNumber ? 'move-list-item-selected' : ''}
            onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      if (winInfo.isDraw) {
        status = "Draw";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    const isAscending = this.state.isAscending;
    if (!isAscending) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <div>
            <p>Ch???n size b??n c??? l???n h??n 5</p>
            <input 
              className='input_size'
              type="number"
              min='5' 
              step='1'
              onChange={sizeChangeHandler}
            />
          </div>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winLine={winInfo.line}
            size={this.state.size}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.handleSortToggle()}>
            {isAscending ? 'descending' : 'ascending'}
          </button>
          <ol>{moves}</ol>
        </div>
        <div className="Info">
        <p>
          Display the location for each move in the format (col, row) in the move history list. 1,5
        </p>
        <p>
          Bold the currently selected item in the move list. 1,5
        </p>
        <p>
          Rewrite Board to use two loops to make the squares instead of hardcoding them. Rewrite the winning rule to 5 consecutive squares. 1,5
        </p>
        <p>
          Add a toggle button that lets you sort the moves in either ascending or descending order. 1,5
        </p>
        <p>
          When someone wins, highlight the three squares that caused the win. 1,5
        </p>
        <p>
          When no one wins, display a message about the result being a draw. 1,5
        </p>
        <p>
          Host your website on public hosting: 1 
        </p>

        <p>
          C?? tham kh???o code c???a b??i gi???ng tu???n tr?????c v?? code th??m v??o
        </p>
        </div>
      </div>
    );
  }
}


function calculateWinner(squares,position,size) {

  const col = 1 + position % size;
  const row = 1 + Math.floor(position / size);


  // ki???m tra d???c tr??n
  let count = 0 ;
  let line = [position];

  for(let i=row+1;i<=size;i++){
    let next = (i-1)*size + (col-1);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
  }

  //ki???m tra d???c d?????i
  for(let i=row-1;i>=1;i--){
    let next = (i-1)*size + (col-1);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
  }

  if(count>=4){
    return {
      winner: squares[position],
      line: line,
      isDraw: false,
    };
    
  }

  //ki???m tra ngang
  count = 0;
  line = [position];

  for(let i=col+1;i<=size;i++){
    let next = (row-1)*size + (i-1);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
  }

  for(let i=col-1;i>=1;i--){
    let next = (row-1)*size + (i-1);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
  }

  if(count>=4){
    console.log(count);
    
    console.log(line);
    return {
      winner: squares[position],
      line: line,
      isDraw: false,
    };
  }

  //check ch??o \
  count = 0;
  line = [position];
  
  let next;
  let i = 1;
  while(col+i<=size&&row+i<=size){
    next = (row-1+i)*size + (col-1+i);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
    i++;
  }

  i=1;
  while(col-i>=1&&row-i>=1){
    next = (row-1-i)*size + (col-1-i);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
    i++;
  }

  if(count>=4){
    console.log(count);
    
    console.log(line);
    return {
      winner: squares[position],
      line: line,
      isDraw: false,
    };
  }


  //ki???m tra ch??o /
  count = 0;
  line = [position];
  i=1;
  while(col-i>=1&&row+i<=size){
    next = (row-1+i)*size + (col-1-i);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
    i++;
  }

  i=1;
  while(col+i<=size && row-i>=1){
    next = (row-1-i)*size + (col-1+i);
    if(squares[next]===squares[position]){
      count++;
      line.push(next);
    }else{
      break;
    }
    i++;
  }

  if(count>=4){
    return {
      winner: squares[position],
      line: line,
      isDraw: false,
    };
  }

  //ki???m tra
  let isDraw = true;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      isDraw = false;
      break;
    }
  }
  return {
    winner: null,
    line: null,
    isDraw: isDraw,
  };
}


export default App;
