// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const INITIAL_HISTORY = Array(Array(9).fill(null))

function Moves({history, currentMove, onMoveSelect}) {
  function getButtonText(index) {
    const text = index ? `Go to move #${index}` : 'Go to game start'
    const isCurrentMove = index === currentMove
    return isCurrentMove ? `${text} (current)` : text
  }

  return (
    <ol>
      {history.map((squares, index) => (
        <li key={JSON.stringify(squares)}>
          <button
            onClick={() => onMoveSelect(index)}
            disabled={index === currentMove}
          >
            {getButtonText(index)}
          </button>
        </li>
      ))}
    </ol>
  )
}

function Board({squares, onSelectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'tic-tac-toe:history',
    INITIAL_HISTORY,
  )
  const [currentMove, setCurrentMove] = useLocalStorageState(
    'tic-tac-toe:move',
    0,
  )

  const currentSquares = history[currentMove]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function handleSelectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }
    const currentSquaresCopy = [...currentSquares]
    currentSquaresCopy[square] = nextValue
    const newHistory = history.slice(0, currentMove + 1)
    setHistory([...newHistory, currentSquaresCopy])
    setCurrentMove(currentMove + 1)
  }

  function restart() {
    setHistory(INITIAL_HISTORY)
    setCurrentMove(0)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} onSelectSquare={handleSelectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          history={history}
          currentMove={currentMove}
          onMoveSelect={setCurrentMove}
        />
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
