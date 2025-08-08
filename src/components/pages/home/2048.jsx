import { useState, useEffect, useCallback } from "react";
import "./2048.css";
const rows = 3,
  cols = 3;

const emptyGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
function Game() {
  const [grid, setGrid] = useState(emptyGrid);

  const getRandom = () => {
    return Math.floor(Math.random() * rows);
  };

  const randomAdd = () => {
    const isFull = grid.every((row) => row.every((cell) => cell !== 0));
    if (isFull) return;

    let randomRow = getRandom();
    let randomCol = getRandom();
    while (grid[randomRow][randomCol] !== 0) {
      randomRow = getRandom();
      randomCol = getRandom();
    }

    setGrid((prev) => {
      const newGrid = prev.map((row) => [...row]);
      newGrid[randomRow][randomCol] = 2;
      console.log(newGrid);
      return newGrid;
    });
  };

  // initial load
  useEffect(() => {
    randomAdd();
    randomAdd();
  }, []);

  const left = useCallback((grid) => {
    console.log("left");
    const newGrid = grid.map((row) => [...row]); // deep copy
    console.log(newGrid);
    let hasChanged = false;

    for (let r = 0; r < rows; r++) {
      const line = newGrid[r].filter((v) => v !== 0);
      console.log(line);
      const merged = [];

      for (let i = 0; i < line.length; i++) {
        if (i < line.length - 1 && line[i] === line[i + 1]) {
          merged.push(line[i] * 2);
          i++; // skip next (merged)
          hasChanged = true;
        } else {
          merged.push(line[i]);
        }
      }
      while (merged.length < cols) merged.push(0);

      if (merged.some((v, idx) => v !== newGrid[r][idx])) hasChanged = true;
      newGrid[r] = merged;
    }

    if (hasChanged) {
      setGrid(newGrid);
    } // only update when something moved
    randomAdd();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          left(grid);
          break;
        case "ArrowRight":
          //   moveRight();
          break;
        case "ArrowUp":
          //   moveUp();
          break;
        case "ArrowDown":
          //   moveDown();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [left, grid]);

  return (
    <>
      <div>
        <p>2048 3x3</p>
        <div className="game-container">
          {grid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div key={`${rowIndex}-${cellIndex}`} className="cell">
                {cell}
              </div>
            ))
          )}
        </div>
        <button onClick={left}>left</button>
      </div>
    </>
  );
}

export default Game;
